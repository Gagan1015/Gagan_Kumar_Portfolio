<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profile;
use App\Models\Experience;
use App\Models\Education;
use App\Models\Project;
use App\Models\Skill;

class PortfolioDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed Profile
        Profile::create([
            'full_name' => 'Gagan Kumar',
            'title' => 'Senior Product Engineer',
            'bio' => 'Senior Product Engineer focused on building intersectional digital experiences',
            'summary' => 'I am a Senior Product Engineer focused on building intersectional digital experiences. With a background in architectural design and computer science, I approach frontend development with a spatial mindset. I specialize in high-performance React applications, design systems, and micro-interactions that elevate usability. Currently exploring the boundaries of Generative AI in UI patterns.',
            'email' => 'contact@gagankumar.dev',
            'location' => 'San Francisco, CA',
            'github_url' => 'https://github.com/gagankumar',
            'linkedin_url' => 'https://linkedin.com/in/gagankumar',
            'years_of_experience' => 8,
            'availability_status' => 'available',
        ]);

        // Seed Experiences
        Experience::create([
            'company' => 'Vercel',
            'position' => 'Senior Frontend Engineer',
            'location' => 'Remote',
            'employment_type' => 'contract',
            'start_date' => '2022-01-01',
            'end_date' => null,
            'is_current' => true,
            'description' => 'Leading the migration of legacy dashboards to a new composable architecture. Implemented a new design system using Tailwind and React Aria, improving accessibility scores by 40%.',
            'technologies' => ['React', 'Next.js', 'TypeScript', 'GraphQL'],
            'display_order' => 1,
            'is_published' => true,
        ]);

        Experience::create([
            'company' => 'Stripe',
            'position' => 'Product Engineer',
            'location' => 'San Francisco, CA',
            'employment_type' => 'full_time',
            'start_date' => '2019-01-01',
            'end_date' => '2022-12-31',
            'is_current' => false,
            'description' => 'Worked on the checkout experience team. Optimized render cycles for high-traffic payment forms, reducing TTI by 300ms. Collaborated closely with design to implement complex motion primitives.',
            'technologies' => ['React', 'Redux', 'Node.js', 'Framer Motion'],
            'display_order' => 2,
            'is_published' => true,
        ]);

        Experience::create([
            'company' => 'Huge Inc.',
            'position' => 'UI Developer',
            'location' => 'New York, NY',
            'employment_type' => 'full_time',
            'start_date' => '2017-01-01',
            'end_date' => '2019-12-31',
            'is_current' => false,
            'description' => 'Developed award-winning marketing sites for Fortune 500 clients. Bridged the gap between creative direction and technical implementation.',
            'technologies' => ['Vue.js', 'WebGL', 'Three.js', 'GSAP'],
            'display_order' => 3,
            'is_published' => true,
        ]);

        // Seed Education
        Education::create([
            'institution' => 'Massachusetts Institute of Technology',
            'degree' => 'B.S. Computer Science',
            'field_of_study' => 'Computer Science',
            'start_date' => '2013-09-01',
            'end_date' => '2017-06-01',
            'is_current' => false,
            'display_order' => 1,
            'is_published' => true,
        ]);

        Education::create([
            'institution' => 'Massachusetts Institute of Technology',
            'degree' => 'Minor in Architectural Design',
            'field_of_study' => 'Architectural Design',
            'start_date' => '2013-09-01',
            'end_date' => '2017-06-01',
            'is_current' => false,
            'display_order' => 2,
            'is_published' => true,
        ]);

        // Seed Projects
        Project::create([
            'title' => 'Lumina Interface',
            'slug' => 'lumina-interface',
            'category' => 'Design System',
            'description' => 'A strict, geometric design system built for data-heavy fintech dashboards. Focus on information density and typographic hierarchy.',
            'image_url' => 'https://picsum.photos/800/600?random=1',
            'technologies' => ['React', 'Storybook', 'Tokens'],
            'status' => 'completed',
            'is_featured' => true,
            'display_order' => 1,
            'is_published' => true,
        ]);

        Project::create([
            'title' => 'Apex Finance',
            'slug' => 'apex-finance',
            'category' => 'Web Application',
            'description' => 'Real-time trading platform featuring WebGL data visualization for market trends. Handles 50k+ updates per second via WebSocket.',
            'image_url' => 'https://picsum.photos/800/600?random=2',
            'technologies' => ['d3.js', 'WebGL', 'WebSockets'],
            'status' => 'completed',
            'is_featured' => true,
            'display_order' => 2,
            'is_published' => true,
        ]);

        Project::create([
            'title' => 'Mono Portfolio',
            'slug' => 'mono-portfolio',
            'category' => 'Website',
            'description' => 'An experimental portfolio concept focusing on monochromatic aesthetics and brutalist typography.',
            'image_url' => 'https://picsum.photos/800/600?random=3',
            'technologies' => ['Next.js', 'Tailwind'],
            'status' => 'completed',
            'is_featured' => false,
            'display_order' => 3,
            'is_published' => true,
        ]);

        Project::create([
            'title' => 'Velvet AI',
            'slug' => 'velvet-ai',
            'category' => 'SaaS Product',
            'description' => 'AI-powered copywriting tool for e-commerce. Integrated OpenAI API with a custom rich text editor.',
            'image_url' => 'https://picsum.photos/800/600?random=4',
            'technologies' => ['OpenAI', 'ProseMirror', 'Node.js'],
            'status' => 'completed',
            'is_featured' => true,
            'display_order' => 4,
            'is_published' => true,
        ]);

        // Seed Skills
        $coreStackSkills = ['React', 'TypeScript', 'Next.js', 'Node.js', 'GraphQL', 'PostgreSQL'];
        $order = 1;
        foreach ($coreStackSkills as $skill) {
            Skill::create([
                'name' => $skill,
                'category' => 'Core Stack',
                'proficiency_level' => 90,
                'years_of_experience' => 5,
                'display_order' => $order++,
                'is_published' => true,
            ]);
        }

        $creativeDevSkills = ['Three.js', 'WebGL', 'Framer Motion', 'GSAP', 'D3.js', 'Canvas API'];
        $order = 1;
        foreach ($creativeDevSkills as $skill) {
            Skill::create([
                'name' => $skill,
                'category' => 'Creative Dev',
                'proficiency_level' => 85,
                'years_of_experience' => 4,
                'display_order' => $order++,
                'is_published' => true,
            ]);
        }

        $designToolsSkills = ['Figma', 'System Design', 'Jest/Vitest', 'Docker', 'AWS', 'CI/CD'];
        $order = 1;
        foreach ($designToolsSkills as $skill) {
            Skill::create([
                'name' => $skill,
                'category' => 'Design & Tools',
                'proficiency_level' => 80,
                'years_of_experience' => 3,
                'display_order' => $order++,
                'is_published' => true,
            ]);
        }
    }
}
