use uuid::Uuid;

pub fn get_base_url() -> String {
    std::env::var("APP_URL").unwrap_or("http://localhost:3000".to_string())
}

pub fn magic_link_for_document_url(document_id: Uuid, otp: &str, user_id: i32) -> String {
    let base_url = get_base_url();
    format!("{base_url}/documents/{document_id}?otp={otp}&user_id={user_id}")
}
