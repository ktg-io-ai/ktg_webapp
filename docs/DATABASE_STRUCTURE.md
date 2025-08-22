# KTG Database Structure

## user_creator_profiles Table

| Column | Type | Collation | Null | Default | Extra |
|--------|------|-----------|------|---------|-------|
| id | int(11) | - | No | None | AUTO_INCREMENT, Primary Key |
| user_id | int(11) | - | No | None | Index |
| creator_role_id | int(11) | - | No | None | Index |
| creator_name | varchar(100) | utf8mb4_unicode_ci | Yes | NULL | |
| creator_tagline | varchar(255) | utf8mb4_unicode_ci | Yes | NULL | |
| bio | text | utf8mb4_unicode_ci | Yes | NULL | |
| profile_image | varchar(255) | utf8mb4_unicode_ci | Yes | NULL | |
| follower_count | int(11) | - | Yes | 0 | |
| location | varchar(255) | utf8mb4_unicode_ci | Yes | NULL | |
| contact_email | varchar(255) | utf8mb4_unicode_ci | Yes | NULL | |
| is_verified | tinyint(1) | - | Yes | 0 | |
| is_active | tinyint(1) | - | Yes | 1 | |
| approval_status | enum('pending', 'approved', 'rejected', 'suspended') | utf8mb4_unicode_ci | Yes | pending | |
| created_at | timestamp | - | No | current_timestamp() | |
| updated_at | timestamp | - | No | current_timestamp() | ON UPDATE CURRENT_TIMESTAMP() |
| instagram_url | varchar(255) | utf8mb4_unicode_ci | Yes | NULL | |
| facebook_url | varchar(255) | utf8mb4_unicode_ci | Yes | NULL | |
| linkedin_url | varchar(255) | utf8mb4_unicode_ci | Yes | NULL | |
| tiktok_url | varchar(255) | utf8mb4_unicode_ci | Yes | NULL | |
| x_url | varchar(255) | utf8mb4_unicode_ci | Yes | NULL | |

## Key Features
- **Primary Key**: `id` (auto-increment)
- **Foreign Keys**: `user_id` (references users table), `creator_role_id` (references creator_roles table)
- **Social Media Integration**: Instagram, Facebook, LinkedIn, TikTok, and X (Twitter) URL fields
- **Approval Workflow**: Status tracking with pending/approved/rejected/suspended states
- **Automatic Timestamps**: `created_at` and `updated_at` with auto-update functionality
- **Contact Management**: Separate `contact_email` field for business communications