use axum::{
    extract::Query,
    http::{HeaderMap, HeaderValue, Method},
    routing::get,
    Json, Router
};
use rand::Rng;
use serde::{Deserialize, Serialize};
use sha1::{Digest, Sha1};
use std::net::SocketAddr;
use std::time::Duration;
use reqwest::Client;
use tokio::net::TcpListener;
use tower_http::cors::{Any, CorsLayer};
use std::collections::HashMap;

// Request and Response structures
#[derive(Deserialize)]
struct PasswordParams {
    length: Option<usize>,
    symbols: Option<bool>,
    numbers: Option<bool>,
}

#[derive(Serialize)]
struct PasswordResponse {
    password: String,
    security_score: SecurityScore,
}

#[derive(Serialize)]
struct SecurityScore {
    overall: u8,
    banking: u8,
    social_media: u8,
    email: u8,
    strength_details: HashMap<String, bool>,
}

#[derive(Deserialize)]
struct PassphraseParams {
    words: Option<usize>,
}

#[derive(Serialize)]
struct PassphraseResponse {
    passphrase: String,
    security_score: SecurityScore,
}

#[derive(Deserialize)]
struct BreachCheckParams {
    password: String,
}

#[derive(Serialize)]
struct BreachResponse {
    breached: bool,
    message: String,
}

#[derive(Deserialize)]
struct SecurityCheckParams {
    password: String,
}

#[derive(Serialize)]
struct SecurityCheckResponse {
    security_score: SecurityScore,
}

// Function to fetch word list dynamically
async fn fetch_word_list() -> Vec<String> {
    // Default wordlist in case the API call fails
    let default_words = vec![
        "apple", "banana", "cherry", "dragon", "elephant", "falcon", "grape", "honey",
        "island", "jungle", "koala", "lemon", "mountain", "night", "orange", "pearl",
        "queen", "river", "sunset", "tiger", "umbrella", "violet", "whale", "xenon",
        "yellow", "zebra"
    ].iter().map(|&s| s.to_string()).collect();
    
    // Try to fetch words from a public API
    let client = Client::builder()
        .timeout(Duration::from_secs(5))
        .build()
        .unwrap_or_else(|_| Client::new());
    
    match client.get("https://random-word-api.herokuapp.com/word?number=100").send().await {
        Ok(response) => {
            if let Ok(words) = response.json::<Vec<String>>().await {
                if !words.is_empty() {
                    return words;
                }
            }
            default_words
        },
        Err(_) => default_words,
    }
}

// Password security evaluation function
fn evaluate_password_security(password: &str) -> SecurityScore {
    let length = password.len();
    let has_lowercase = password.chars().any(|c| c.is_ascii_lowercase());
    let has_uppercase = password.chars().any(|c| c.is_ascii_uppercase());
    let has_numbers = password.chars().any(|c| c.is_ascii_digit());
    let has_symbols = password.chars().any(|c| !c.is_alphanumeric());
    
    // Calculate character set size for entropy calculation
    let charset_size = 
        (if has_lowercase { 26 } else { 0 }) +
        (if has_uppercase { 26 } else { 0 }) +
        (if has_numbers { 10 } else { 0 }) +
        (if has_symbols { 33 } else { 0 });
    
    // Calculate entropy bits (rough approximation)
    let entropy = if charset_size > 0 {
        (length as f64) * (charset_size as f64).log2()
    } else {
        0.0
    };
    
    // Build strength details map
    let mut strength_details = HashMap::new();
    strength_details.insert("length_sufficient".to_string(), length >= 12);
    strength_details.insert("has_lowercase".to_string(), has_lowercase);
    strength_details.insert("has_uppercase".to_string(), has_uppercase);
    strength_details.insert("has_numbers".to_string(), has_numbers);
    strength_details.insert("has_symbols".to_string(), has_symbols);
    strength_details.insert("high_entropy".to_string(), entropy > 60.0);
    
    // Calculate scores for different contexts
    let overall_score = calculate_score(
        length, has_lowercase, has_uppercase, has_numbers, has_symbols, 1.0, 1.0, 1.0, 1.0
    );
    
    let banking_score = calculate_score(
        length, has_lowercase, has_uppercase, has_numbers, has_symbols, 1.5, 1.2, 1.2, 1.5
    );
    
    let social_media_score = calculate_score(
        length, has_lowercase, has_uppercase, has_numbers, has_symbols, 1.2, 1.0, 1.2, 1.0
    );
    
    let email_score = calculate_score(
        length, has_lowercase, has_uppercase, has_numbers, has_symbols, 1.3, 1.1, 1.3, 1.2
    );
    
    SecurityScore {
        overall: overall_score,
        banking: banking_score,
        social_media: social_media_score,
        email: email_score,
        strength_details,
    }
}

fn calculate_score(
    length: usize, 
    has_lowercase: bool, 
    has_uppercase: bool, 
    has_numbers: bool, 
    has_symbols: bool,
    length_weight: f64,
    case_weight: f64,
    number_weight: f64,
    symbol_weight: f64
) -> u8 {
    // Base score from length
    let length_score = if length < 8 {
        20.0 * length_weight
    } else if length < 12 {
        40.0 * length_weight
    } else if length < 16 {
        60.0 * length_weight
    } else {
        80.0 * length_weight
    };
    
    // Character set diversity score
    let diversity_score = 
        (if has_lowercase { 5.0 * case_weight } else { 0.0 }) +
        (if has_uppercase { 5.0 * case_weight } else { 0.0 }) +
        (if has_numbers { 5.0 * number_weight } else { 0.0 }) +
        (if has_symbols { 5.0 * symbol_weight } else { 0.0 });
    
    // Combine scores and cap at 100
    let total_score = (length_score + diversity_score).min(100.0);
    total_score as u8
}

// Route handlers
async fn generate_password(Query(params): Query<PasswordParams>) -> Json<PasswordResponse> {
    let length = params.length.unwrap_or(16);
    let use_symbols = params.symbols.unwrap_or(true);
    let use_numbers = params.numbers.unwrap_or(true);
    
    let mut charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".to_string();
    if use_symbols {
        charset += "!@#$%^&*()_+-=[]{}";
    }
    if use_numbers {
        charset += "0123456789";
    }
    
    let mut rng = rand::thread_rng();
    let password: String = (0..length)
        .map(|_| {
            let idx = rng.gen_range(0..charset.len());
            charset.chars().nth(idx).unwrap()
        })
        .collect();
    
    // Evaluate password security
    let security_score = evaluate_password_security(&password);
    
    Json(PasswordResponse { 
        password,
        security_score
    })
}

async fn generate_passphrase(Query(params): Query<PassphraseParams>) -> Json<PassphraseResponse> {
    let words = params.words.unwrap_or(4);
    let word_list = fetch_word_list().await;
    
    let mut rng = rand::thread_rng();
    let phrase: Vec<String> = (0..words)
        .map(|_| {
            let idx = rng.gen_range(0..word_list.len());
            word_list[idx].clone()
        })
        .collect();
    
    let passphrase = phrase.join("-");
    
    // Evaluate passphrase security
    let security_score = evaluate_password_security(&passphrase);
    
    Json(PassphraseResponse {
        passphrase,
        security_score
    })
}

async fn check_security(Query(params): Query<SecurityCheckParams>) -> Json<SecurityCheckResponse> {
    let security_score = evaluate_password_security(&params.password);
    
    Json(SecurityCheckResponse {
        security_score
    })
}

async fn check_breach(Query(params): Query<BreachCheckParams>) -> Json<BreachResponse> {
    // Create proper SHA-1 hash
    let mut hasher = Sha1::new();
    hasher.update(params.password.as_bytes());
    let hash = format!("{:X}", hasher.finalize());
    
    let prefix = &hash[..5];
    let suffix = &hash[5..];
    
    let url = format!("https://api.pwnedpasswords.com/range/{}", prefix);
    let client = Client::builder().timeout(Duration::from_secs(5)).build().unwrap_or_else(|_| Client::new());
    
    match client.get(&url).send().await {
        Ok(resp) => {
            if let Ok(body) = resp.text().await {
                for line in body.lines() {
                    let parts: Vec<&str> = line.split(':').collect();
                    if parts.len() > 1 && parts[0] == suffix {
                        return Json(BreachResponse {
                            breached: true,
                            message: "This password has been found in data breaches!".into(),
                        });
                    }
                }
            }
        }
        Err(_) => {
            return Json(BreachResponse {
                breached: false,
                message: "Could not check breach status.".into(),
            });
        }
    }
    
    Json(BreachResponse {
        breached: false,
        message: "No breach found.".into(),
    })
}

#[tokio::main]
async fn main() {
    // Configure CORS
    let cors = CorsLayer::new()
        // Allow requests from any origin
        .allow_origin(Any)
        // Allow common methods
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        // Allow common headers
        .allow_headers(Any);
    
    // Create router with routes and add CORS middleware
    let app = Router::new()
        .route("/generate", get(generate_password))
        .route("/passphrase", get(generate_passphrase))
        .route("/breach-check", get(check_breach))
        .route("/security-check", get(check_security))
        .layer(cors);
    
    // Define the address
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));


    println!("Server running on http://{}", addr);
    
    // Create a TcpListener
    let listener = TcpListener::bind(addr).await.unwrap();
    
    // Start the server
    axum::serve(listener, app).await.unwrap();
}