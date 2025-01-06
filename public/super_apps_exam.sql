-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 06, 2025 at 09:49 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `super_apps_exam`
--

-- --------------------------------------------------------

--
-- Table structure for table `access_user`
--

CREATE TABLE `access_user` (
  `id` int NOT NULL,
  `token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `expired_at` date NOT NULL,
  `user_id` int NOT NULL,
  `limit_exam` int NOT NULL,
  `limit_user` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `access_user`
--

INSERT INTO `access_user` (`id`, `token`, `start_date`, `expired_at`, `user_id`, `limit_exam`, `limit_user`, `created_at`, `updated_at`) VALUES
(1, 'qweqwqAddeSFdesf', '2024-12-10', '2024-12-16', 1, 10, 100, '2024-12-10 07:45:20', '2024-12-10 07:45:20'),
(2, 'fdsfhsudhfdskfniu', '2024-12-16', '2025-12-31', 1, 10, 100, '2024-12-17 02:36:28', '2024-12-17 02:36:26'),
(3, 'fdsfhsudhfdskfniu', '2024-12-24', '2025-12-31', 4, 10, 100, '2024-12-24 09:01:54', '2024-12-24 09:01:51');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `grouping_list_ids` text,
  `except_user_ids` text,
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `name`, `start_date`, `end_date`, `user_id`, `grouping_list_ids`, `except_user_ids`, `created_at`, `updated_at`) VALUES
(1, 'UJIAN NASIONAL 2024', '2024-12-18 21:00:00', '2025-12-31 17:00:00', 1, '1,2', '2', NULL, NULL),
(2, 'TRY OUT 2023', '2024-12-16 08:00:00', '2025-12-16 12:00:00', 1, '1', '2,3', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groupings`
--

CREATE TABLE `groupings` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `groupings`
--

INSERT INTO `groupings` (`id`, `name`, `level`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'KELAS 7A', '7', 1, '2024-12-16 03:24:27', '2024-12-17 07:47:43'),
(2, 'KELAS 7B', '7', 1, '2024-12-16 03:24:33', '2024-12-17 07:47:39'),
(3, 'KELAS 7C', '7', 1, NULL, '2024-12-17 07:47:38'),
(4, 'KELAS 7D', '7', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE `options` (
  `id` int NOT NULL,
  `text` text,
  `match_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `is_true` int DEFAULT NULL,
  `question_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `options`
--

INSERT INTO `options` (`id`, `text`, `match_text`, `is_true`, `question_id`, `created_at`, `updated_at`) VALUES
(1, 'Reynaldi', NULL, 1, 1, '2024-12-23 07:56:00', '2024-12-23 07:56:20'),
(2, 'Akbar', NULL, 0, 1, '2024-12-23 07:56:08', '2024-12-23 07:56:20'),
(3, 'Yasril', NULL, 0, 1, '2024-12-23 07:56:12', '2024-12-23 07:56:20'),
(4, 'Facebook', NULL, 1, 2, '2024-12-23 07:56:37', NULL),
(5, 'Whatsapp', NULL, 1, 2, '2024-12-23 07:56:45', NULL),
(6, 'Kuda', NULL, 0, 2, '2024-12-23 07:56:48', NULL),
(7, 'Indonesia', 'Jakarta', 1, 6, '2025-01-04 17:40:19', NULL),
(8, 'Malaysia', 'Kuala Lumpur', 1, 6, '2025-01-04 17:40:30', NULL),
(9, 'Jepang', 'Tokyo', 1, 6, '2025-01-06 09:32:35', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `options_user`
--

CREATE TABLE `options_user` (
  `id` int NOT NULL,
  `question_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `option_id` text,
  `text` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `options_user`
--

INSERT INTO `options_user` (`id`, `question_id`, `user_id`, `option_id`, `text`, `created_at`, `updated_at`) VALUES
(18, 4, 3, '', 'fdsfdsfhu', '2025-01-05 04:40:08', NULL),
(19, 3, 3, '', 'tssuasdnkn', '2025-01-05 04:40:59', NULL),
(42, 2, 3, '4,5,6', '', '2025-01-05 17:44:17', NULL),
(43, 1, 3, '1', '', '2025-01-06 07:28:10', NULL),
(47, 6, 3, '7,null,9', '', '2025-01-06 09:34:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int NOT NULL,
  `question` text,
  `type` varchar(100) DEFAULT NULL,
  `question_bank_id` int DEFAULT NULL,
  `number_of` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `question`, `type`, `question_bank_id`, `number_of`, `created_at`, `updated_at`) VALUES
(1, 'Nama Saya ?', 'multiple', 1, 1, '2024-12-18 04:27:16', '2024-12-19 04:17:09'),
(2, 'Sebutkan App ?', 'complex', 1, 2, '2024-12-19 04:17:26', NULL),
(3, 'berikan penjelasan', 'essay', 1, 3, '2024-12-19 04:17:45', NULL),
(4, 'berikan penjelasan', 'essay', 1, 4, '2024-12-19 04:17:45', '2024-12-19 08:44:36'),
(5, 'berikan penjelasan', 'essay', 2, 1, '2024-12-19 04:17:45', '2024-12-19 08:44:36'),
(6, 'jodohkan', 'match', 1, 5, '2025-01-04 17:39:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `question_banks`
--

CREATE TABLE `question_banks` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_active` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `multiple_true_poin` int DEFAULT '0',
  `complex_true_poin` int DEFAULT '0',
  `match_true_poin` int DEFAULT '0',
  `multiple_false_poin` int DEFAULT '0',
  `complex_false_poin` int DEFAULT '0',
  `match_false_poin` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `question_banks`
--

INSERT INTO `question_banks` (`id`, `name`, `is_active`, `user_id`, `multiple_true_poin`, `complex_true_poin`, `match_true_poin`, `multiple_false_poin`, `complex_false_poin`, `match_false_poin`, `created_at`, `updated_at`) VALUES
(1, 'Soal AKM UJIAN NASIONAL', 1, 1, 0, 0, 0, 0, 0, 0, '2024-12-18 04:19:56', '2024-12-18 06:23:24');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('MsHN4QWeCUWeoFedAqsriehA8vcnJMptwE4eAlAe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTo2OntzOjY6Il90b2tlbiI7czo0MDoieThaTGVObFBRbVUwa1R0M2d1THEwcjdGT0NPOXZuUnA5eHVuMlczMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6ODoidXNlcm5hbWUiO3M6ODoicmV5bmFsZGkiO3M6MjoiaWQiO3M6MToiMSI7czo1OiJ0b2tlbiI7czoxNjoicXdlcXdxQWRkZVNGZGVzZiI7fQ==', 1733823978);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` bigint DEFAULT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token_app` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `grouping_id` int DEFAULT NULL,
  `is_active` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `parent_id`, `remember_token`, `token_app`, `grouping_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'reynaldi', 'ae0b2b2d9c8c4662d42042dd3ae376b2', 'admin', NULL, NULL, 'fdsfhsudhfdskfniu', NULL, 1, NULL, NULL),
(2, 'akbar', 'ae0b2b2d9c8c4662d42042dd3ae376b2', 'user', 1, NULL, NULL, 2, 1, NULL, NULL),
(3, 'yasril', 'ae0b2b2d9c8c4662d42042dd3ae376b2', 'user', 1, NULL, NULL, 2, 1, NULL, NULL),
(4, 'admin', 'ae0b2b2d9c8c4662d42042dd3ae376b2', 'admin', NULL, NULL, 'fdsfhsudhfdskfniu', 2, 1, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `access_user`
--
ALTER TABLE `access_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `groupings`
--
ALTER TABLE `groupings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `options_user`
--
ALTER TABLE `options_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `question_banks`
--
ALTER TABLE `question_banks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `access_user`
--
ALTER TABLE `access_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groupings`
--
ALTER TABLE `groupings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `options_user`
--
ALTER TABLE `options_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `question_banks`
--
ALTER TABLE `question_banks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
