<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use App\Models\Project;
use Filament\Widgets\ChartWidget;

class ContentStatusChart extends ChartWidget
{
    protected static ?int $sort = -3;

    protected int|string|array $columnSpan = [
        'default' => 1,
        'lg' => 1,
    ];

    protected ?string $heading = 'Publishing Pipeline';

    protected ?string $description = 'Published vs draft content across your portfolio CMS.';

    protected string $color = 'info';

    protected ?string $pollingInterval = '60s';

    protected function getData(): array
    {
        $publishedProjects = Project::query()->where('is_published', true)->count();
        $draftProjects = Project::query()->where('is_published', false)->count();
        $publishedPosts = BlogPost::query()->where('is_published', true)->count();
        $draftPosts = BlogPost::query()->where('is_published', false)->count();

        return [
            'datasets' => [
                [
                    'label' => 'Published',
                    'data' => [$publishedProjects, $publishedPosts],
                    'backgroundColor' => '#0ea5e9',
                    'borderColor' => '#0284c7',
                ],
                [
                    'label' => 'Drafts',
                    'data' => [$draftProjects, $draftPosts],
                    'backgroundColor' => '#f59e0b',
                    'borderColor' => '#d97706',
                ],
            ],
            'labels' => ['Projects', 'Blog posts'],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
