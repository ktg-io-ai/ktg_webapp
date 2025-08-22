-- Independent Contractor Database Schema

-- Contractor agreements table
CREATE TABLE IF NOT EXISTS contractor_agreements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    creator_profile_id INT NOT NULL,
    agreement_type ENUM('independent_contractor', 'nda', 'w9', 'direct_deposit') NOT NULL,
    status ENUM('pending', 'completed', 'expired', 'rejected') DEFAULT 'pending',
    form_data JSON,
    signature_data JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    signed_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_profile_id) REFERENCES user_creator_profiles(id) ON DELETE CASCADE,
    INDEX idx_creator_status (creator_profile_id, status),
    INDEX idx_agreement_type (agreement_type)
);

-- Contractor documents table for file uploads
CREATE TABLE IF NOT EXISTS contractor_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agreement_id INT NOT NULL,
    document_type ENUM('w9_form', 'id_verification', 'bank_info', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agreement_id) REFERENCES contractor_agreements(id) ON DELETE CASCADE
);

-- Contractor payment information
CREATE TABLE IF NOT EXISTS contractor_payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    creator_profile_id INT NOT NULL,
    payment_method ENUM('direct_deposit', 'paypal', 'check') NOT NULL,
    bank_name VARCHAR(100),
    routing_number VARCHAR(20),
    account_number VARCHAR(50),
    account_type ENUM('checking', 'savings'),
    paypal_email VARCHAR(255),
    mailing_address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_profile_id) REFERENCES user_creator_profiles(id) ON DELETE CASCADE
);

-- Contractor compliance tracking
CREATE TABLE IF NOT EXISTS contractor_compliance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    creator_profile_id INT NOT NULL,
    w9_completed BOOLEAN DEFAULT FALSE,
    w9_completed_at TIMESTAMP NULL,
    nda_signed BOOLEAN DEFAULT FALSE,
    nda_signed_at TIMESTAMP NULL,
    contractor_agreement_signed BOOLEAN DEFAULT FALSE,
    contractor_agreement_signed_at TIMESTAMP NULL,
    background_check_status ENUM('not_required', 'pending', 'passed', 'failed') DEFAULT 'not_required',
    compliance_status ENUM('incomplete', 'pending_review', 'compliant', 'non_compliant') DEFAULT 'incomplete',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_profile_id) REFERENCES user_creator_profiles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_creator_compliance (creator_profile_id)
);