<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductionDataSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data (except users table to keep admin user)
        DB::table('education')->truncate();
        DB::table('experiences')->truncate();
        DB::table('profiles')->truncate();
        DB::table('projects')->truncate();
        DB::table('skills')->truncate();

        // Seed Education
        DB::table('education')->insert([
            [
                'id' => 1,
                'institution' => 'Meerut Institute of Engineering & Technology',
                'degree' => 'Bachelor of Engineering/Technology',
                'field_of_study' => 'Computer Science',
                'location' => null,
                'start_date' => '2020-08-01',
                'end_date' => '2025-06-23',
                'is_current' => 0,
                'grade' => null,
                'description' => null,
                'activities' => null,
                'logo' => null,
                'website_url' => null,
                'display_order' => 1,
                'is_published' => 1,
                'created_at' => '2025-11-21 19:55:18',
                'updated_at' => '2025-11-21 21:24:18',
            ],
            [
                'id' => 2,
                'institution' => 'R S M S Vidya Mandir',
                'degree' => 'Intermediate',
                'field_of_study' => 'PCM',
                'location' => null,
                'start_date' => '2019-04-01',
                'end_date' => '2020-07-01',
                'is_current' => 0,
                'grade' => null,
                'description' => null,
                'activities' => null,
                'logo' => null,
                'website_url' => null,
                'display_order' => 2,
                'is_published' => 1,
                'created_at' => '2025-11-21 19:55:18',
                'updated_at' => '2025-11-21 21:26:35',
            ],
            [
                'id' => 3,
                'institution' => 'R S M S Vidya Mandir',
                'degree' => 'High School',
                'field_of_study' => null,
                'location' => null,
                'start_date' => '2017-04-22',
                'end_date' => '2018-07-01',
                'is_current' => 0,
                'grade' => null,
                'description' => null,
                'activities' => null,
                'logo' => null,
                'website_url' => null,
                'display_order' => 3,
                'is_published' => 1,
                'created_at' => '2025-11-21 21:28:30',
                'updated_at' => '2025-11-21 21:30:34',
            ],
        ]);

        // Seed Experiences
        DB::table('experiences')->insert([
            [
                'id' => 1,
                'company' => 'Global Matrix Solution',
                'position' => 'Full Stack Developer',
                'location' => 'Meerut, UP',
                'employment_type' => 'full_time',
                'start_date' => '2025-06-01',
                'end_date' => null,
                'is_current' => 1,
                'description' => 'Building and maintaining dynamic full-stack applications using Laravel, PHP, JavaScript, and WordPress. Delivered key projects including a job-seeking platform (Skills360), a personalized matchmaking app (DelWell), and an immigration services website (Kairo Global). Focused on performance optimization, responsive UI, real-time features, and SEO-friendly development to enhance overall user experience.',
                'responsibilities' => '[]',
                'technologies' => '["Laravel","JavaScript","Tailwind CSS","REACT","Next.js"]',
                'company_logo' => null,
                'website_url' => null,
                'display_order' => 1,
                'is_published' => 1,
                'created_at' => '2025-11-23 01:11:39',
                'updated_at' => '2025-11-23 01:40:30',
            ],
        ]);

        // Seed Profiles
        DB::table('profiles')->insert([
            [
                'id' => 1,
                'full_name' => 'Gagan Kumar',
                'title' => 'Full Stack Developer',
                'bio' => 'Full Stack Developer focused on building intersectional digital experiences',
                'summary' => 'Computer Science Engineering graduate with hands-on experience in Laravel, PHP, JavaScript, and WordPress-based frontend development. Skilled
in building responsive and dynamic web applications with a strong foundation in data structures, algorithms, and problem-solving. Currently
expanding expertise in backend development, focusing on databases, APIs, and server-side programming, with the goal of transitioning into a
backend engineering role.',
                'email' => 'gagansaini1510@gmail.com',
                'phone' => '+91 8439465686',
                'location' => 'Meerut, UP',
                'avatar' => null,
                'resume_url' => null,
                'github_url' => 'https://github.com/gagankumar',
                'linkedin_url' => 'https://www.linkedin.com/in/gagan-kumar1510',
                'twitter_url' => 'https://x.com/Gagansa47600331',
                'website_url' => null,
                'years_of_experience' => 1,
                'availability_status' => 'available',
                'meta_title' => null,
                'meta_description' => null,
                'created_at' => '2025-11-21 19:55:18',
                'updated_at' => '2025-11-21 21:12:21',
            ],
        ]);

        // Seed Projects
        DB::table('projects')->insert([
            [
                'id' => 1,
                'title' => 'Skills360.ai – Job-Seeking and Job-Posting Platform',
                'slug' => 'skills360',
                'category' => 'Web Application',
                'description' => 'A Laravel-based platform featuring user authentication, an intuitive admin panel, AI-powered job matching, and a built-in resume builder to streamline the hiring and job search experience.',
                'long_description' => null,
                'image_url' => 'projects/01KAQQVQ70YPZY87B42PDGK4MY.png',
                'gallery_images' => '[]',
                'technologies' => '["Laravel","Tailwind CSS"]',
                'features' => '[]',
                'github_url' => null,
                'demo_url' => null,
                'website_url' => 'https://www.skills360.ai/',
                'start_date' => null,
                'end_date' => null,
                'client' => null,
                'role' => null,
                'status' => 'completed',
                'is_featured' => 1,
                'display_order' => 1,
                'is_published' => 1,
                'meta_title' => null,
                'meta_description' => null,
                'created_at' => '2025-11-23 01:11:39',
                'updated_at' => '2025-11-23 01:24:12',
            ],
            [
                'id' => 2,
                'title' => 'DelWell',
                'slug' => 'delwell',
                'category' => 'Web Application',
                'description' => 'A Laravel-powered dating platform offering personalized matchmaking, interactive user profiles, and real-time communication for an engaging and seamless user experience.',
                'long_description' => null,
                'image_url' => 'projects/01KAQR32X1C9JESE7C80H8EYQ4.png',
                'gallery_images' => '[]',
                'technologies' => '["Laravel","Tailwind CSS"]',
                'features' => '[]',
                'github_url' => null,
                'demo_url' => null,
                'website_url' => 'https://hellodelwell.com/',
                'start_date' => null,
                'end_date' => null,
                'client' => null,
                'role' => null,
                'status' => 'completed',
                'is_featured' => 1,
                'display_order' => 2,
                'is_published' => 1,
                'meta_title' => null,
                'meta_description' => null,
                'created_at' => '2025-11-23 01:11:39',
                'updated_at' => '2025-11-23 01:28:14',
            ],
            [
                'id' => 3,
                'title' => 'Kairo Global - Immigration Service Website',
                'slug' => 'kairo-global',
                'category' => 'Website',
                'description' => 'Developed a fully responsive custom WordPress site with easy content management, optimized performance, and SEO-focused design for enhanced user engagement.',
                'long_description' => null,
                'image_url' => 'projects/01KAQRCE5D7SK4AQAZ464RRHAD.png',
                'gallery_images' => '[]',
                'technologies' => '["HTML","CSS","JavaScript"]',
                'features' => '[]',
                'github_url' => null,
                'demo_url' => null,
                'website_url' => 'https://kairoglobal.co.in/',
                'start_date' => null,
                'end_date' => null,
                'client' => null,
                'role' => null,
                'status' => 'completed',
                'is_featured' => 0,
                'display_order' => 3,
                'is_published' => 1,
                'meta_title' => null,
                'meta_description' => null,
                'created_at' => '2025-11-23 01:11:39',
                'updated_at' => '2025-11-23 01:33:20',
            ],
            [
                'id' => 4,
                'title' => 'DolceVitale – Premium e-commerce Site',
                'slug' => 'dolcevitale',
                'category' => 'e-commerce Site',
                'description' => 'Built a modern, responsive WooCommerce store showcasing premium wellness products with polished product pages, smooth checkout, and SEO-optimized design for higher conversions.',
                'long_description' => null,
                'image_url' => 'projects/01KAQS4DWNWM3YD25P0HEZTRRT.png',
                'gallery_images' => '[]',
                'technologies' => '["Woocommerce","Wordpress","PHP"]',
                'features' => '[]',
                'github_url' => null,
                'demo_url' => null,
                'website_url' => 'https://dolcevitale.com/',
                'start_date' => null,
                'end_date' => null,
                'client' => null,
                'role' => null,
                'status' => 'completed',
                'is_featured' => 1,
                'display_order' => 4,
                'is_published' => 1,
                'meta_title' => null,
                'meta_description' => null,
                'created_at' => '2025-11-23 01:11:39',
                'updated_at' => '2025-11-23 01:46:26',
            ],
        ]);

        // Seed Skills
        DB::table('skills')->insert([
            ['id' => 1, 'name' => 'Laravel', 'category' => 'Core Stack', 'proficiency_level' => 90, 'years_of_experience' => 5, 'icon' => null, 'description' => null, 'display_order' => 1, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-23 01:49:18'],
            ['id' => 2, 'name' => 'JavaScript', 'category' => 'Core Stack', 'proficiency_level' => 90, 'years_of_experience' => 5, 'icon' => null, 'description' => null, 'display_order' => 2, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-23 01:49:47'],
            ['id' => 3, 'name' => 'REACT', 'category' => 'Core Stack', 'proficiency_level' => 90, 'years_of_experience' => 5, 'icon' => null, 'description' => null, 'display_order' => 3, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-23 01:50:13'],
            ['id' => 4, 'name' => 'Node.js', 'category' => 'Core Stack', 'proficiency_level' => 90, 'years_of_experience' => 5, 'icon' => null, 'description' => null, 'display_order' => 4, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-21 19:55:18'],
            ['id' => 5, 'name' => 'My SQL', 'category' => 'Core Stack', 'proficiency_level' => 90, 'years_of_experience' => 5, 'icon' => null, 'description' => null, 'display_order' => 5, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-23 01:51:29'],
            ['id' => 6, 'name' => 'PostgreSQL', 'category' => 'Core Stack', 'proficiency_level' => 90, 'years_of_experience' => 5, 'icon' => null, 'description' => null, 'display_order' => 6, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-21 19:55:18'],
            ['id' => 7, 'name' => 'Tailwind CSS', 'category' => 'Creative Dev', 'proficiency_level' => 85, 'years_of_experience' => 4, 'icon' => null, 'description' => null, 'display_order' => 1, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-23 02:12:48'],
            ['id' => 8, 'name' => 'Bootstrap', 'category' => 'Creative Dev', 'proficiency_level' => 85, 'years_of_experience' => 4, 'icon' => null, 'description' => null, 'display_order' => 2, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-23 02:23:19'],
            ['id' => 9, 'name' => 'Framer Motion', 'category' => 'Creative Dev', 'proficiency_level' => 85, 'years_of_experience' => 4, 'icon' => null, 'description' => null, 'display_order' => 3, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-21 19:55:18'],
            ['id' => 10, 'name' => 'Shad CDN', 'category' => 'Creative Dev', 'proficiency_level' => 85, 'years_of_experience' => 4, 'icon' => null, 'description' => null, 'display_order' => 4, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-23 02:49:11'],
            ['id' => 11, 'name' => 'Alpine.js', 'category' => 'Creative Dev', 'proficiency_level' => 85, 'years_of_experience' => 4, 'icon' => null, 'description' => null, 'display_order' => 5, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-23 02:49:50'],
            ['id' => 12, 'name' => 'Canvas API', 'category' => 'Creative Dev', 'proficiency_level' => 85, 'years_of_experience' => 4, 'icon' => null, 'description' => null, 'display_order' => 6, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-21 19:55:18'],
            ['id' => 14, 'name' => 'System Design', 'category' => 'Design & Tools', 'proficiency_level' => 80, 'years_of_experience' => 3, 'icon' => null, 'description' => null, 'display_order' => 1, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-23 02:04:39'],
            ['id' => 16, 'name' => 'Docker', 'category' => 'Design & Tools', 'proficiency_level' => 80, 'years_of_experience' => 3, 'icon' => null, 'description' => null, 'display_order' => 2, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-23 02:05:08'],
            ['id' => 17, 'name' => 'AWS', 'category' => 'Design & Tools', 'proficiency_level' => 80, 'years_of_experience' => 3, 'icon' => null, 'description' => null, 'display_order' => 3, 'is_published' => 1, 'created_at' => '2025-11-21 19:55:18', 'updated_at' => '2025-11-23 02:05:49'],
            ['id' => 19, 'name' => 'Git', 'category' => 'Design & Tools', 'proficiency_level' => 90, 'years_of_experience' => 5, 'icon' => null, 'description' => null, 'display_order' => 4, 'is_published' => 1, 'created_at' => '2025-11-23 02:03:30', 'updated_at' => '2025-11-23 02:06:23'],
        ]);

        $this->command->info('Production data seeded successfully!');
    }
}
