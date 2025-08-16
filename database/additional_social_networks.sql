-- Additional Social Networks for Lucy AI
-- Date: December 19, 2024

-- Add more social networks and platforms
INSERT INTO lucy_social_networks (platform_name, platform_type, daily_post_limit, rate_limit_per_hour, optimal_posting_times, hashtag_strategy) VALUES
('Facebook', 'social_media', 8, 2, JSON_ARRAY(9, 13, 17, 20), JSON_OBJECT('max_hashtags', 5, 'community_focus', true)),
('Snapchat', 'social_media', 10, 3, JSON_ARRAY(11, 15, 19), JSON_OBJECT('max_hashtags', 3, 'story_focus', true)),
('Pinterest', 'social_media', 15, 4, JSON_ARRAY(10, 14, 16, 21), JSON_OBJECT('max_hashtags', 20, 'visual_discovery', true)),
('Threads', 'social_media', 12, 3, JSON_ARRAY(9, 12, 15, 18), JSON_OBJECT('max_hashtags', 5, 'conversation_focus', true)),
('Mastodon', 'social_media', 20, 5, JSON_ARRAY(10, 14, 18), JSON_OBJECT('max_hashtags', 10, 'decentralized_focus', true)),
('Bluesky', 'social_media', 15, 4, JSON_ARRAY(9, 13, 17, 21), JSON_OBJECT('max_hashtags', 5, 'microblogging_focus', true)),
('Steam Community', 'gaming', 5, 1, JSON_ARRAY(16, 19, 22), JSON_OBJECT('gaming_focus', true, 'community_driven', true)),
('Epic Games Store', 'gaming', 3, 1, JSON_ARRAY(15, 18, 20), JSON_OBJECT('gaming_focus', true, 'store_promotion', true)),
('Itch.io', 'gaming', 5, 2, JSON_ARRAY(14, 17, 20), JSON_OBJECT('indie_focus', true, 'developer_community', true)),
('GameJolt', 'gaming', 8, 2, JSON_ARRAY(15, 18, 21), JSON_OBJECT('indie_gaming', true, 'community_focus', true)),
('Kick', 'gaming', 10, 3, JSON_ARRAY(16, 19, 22), JSON_OBJECT('streaming_focus', true, 'gaming_content', true)),
('Rumble', 'video', 5, 2, JSON_ARRAY(12, 16, 19), JSON_OBJECT('video_focus', true, 'alternative_platform', true)),
('Vimeo', 'video', 3, 1, JSON_ARRAY(11, 15, 18), JSON_OBJECT('professional_video', true, 'creative_focus', true)),
('Dailymotion', 'video', 5, 2, JSON_ARRAY(13, 17, 20), JSON_OBJECT('video_sharing', true, 'international_focus', true)),
('Medium', 'tech', 2, 1, JSON_ARRAY(9, 14, 18), JSON_OBJECT('long_form_content', true, 'thought_leadership', true)),
('Dev.to', 'tech', 3, 1, JSON_ARRAY(10, 15, 19), JSON_OBJECT('developer_community', true, 'technical_content', true)),
('Hacker News', 'tech', 1, 1, JSON_ARRAY(9, 14), JSON_OBJECT('tech_news', true, 'discussion_focus', true)),
('Product Hunt', 'tech', 1, 1, JSON_ARRAY(12), JSON_OBJECT('product_launch', true, 'startup_focus', true)),
('Clubhouse', 'podcast', 5, 2, JSON_ARRAY(19, 21), JSON_OBJECT('audio_focus', true, 'live_conversation', true)),
('Spotify Podcasts', 'podcast', 2, 1, JSON_ARRAY(8, 17), JSON_OBJECT('podcast_focus', true, 'audio_content', true)),
('Substack', 'news', 3, 1, JSON_ARRAY(9, 15, 18), JSON_OBJECT('newsletter_focus', true, 'subscription_model', true)),
('Ghost', 'news', 2, 1, JSON_ARRAY(10, 16), JSON_OBJECT('publishing_platform', true, 'content_focus', true));