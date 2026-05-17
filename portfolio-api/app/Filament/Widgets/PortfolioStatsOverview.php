<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class PortfolioStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = -4;

    protected ?string $pollingInterval = '60s';

    protected function getStats(): array
    {
        $profile = Profile::query()->first();
        $publishedProjects = Project::query()->where('is_published', true)->count();
        $draftProjects = Project::query()->where('is_published', false)->count();
        $publishedPosts = BlogPost::query()->where('is_published', true)->count();
        $draftPosts = BlogPost::query()->where('is_published', false)->count();
        $skills = Skill::query()->where('is_published', true)->count();
        $currentRoles = Experience::query()
            ->where('is_published', true)
            ->where('is_current', true)
            ->count();

        return [
            Stat::make('Portfolio Status', ucfirst(str_replace('_', ' ', $profile?->availability_status ?? 'not set')))
                ->description($profile?->full_name ? "Profile: {$profile->full_name}" : 'Profile needs setup')
                ->descriptionIcon(Heroicon::CheckCircle)
                ->color($profile?->availability_status === 'available' ? 'success' : 'warning'),

            Stat::make('Published Projects', $publishedProjects)
                ->description($draftProjects.' draft '.str('project')->plural($draftProjects))
                ->descriptionIcon($draftProjects > 0 ? Heroicon::ExclamationTriangle : Heroicon::CheckCircle)
                ->chart($this->countRecent(Project::class))
                ->color($draftProjects > 0 ? 'warning' : 'success'),

            Stat::make('Published Posts', $publishedPosts)
                ->description($draftPosts.' draft '.str('post')->plural($draftPosts))
                ->descriptionIcon($draftPosts > 0 ? Heroicon::Clock : Heroicon::CheckCircle)
                ->chart($this->countRecent(BlogPost::class))
                ->color($draftPosts > 0 ? 'warning' : 'success'),

            Stat::make('Skills & Current Roles', "{$skills} / {$currentRoles}")
                ->description('Published skills / active roles')
                ->descriptionIcon(Heroicon::CodeBracket)
                ->color('info'),
        ];
    }

    /**
     * @param  class-string<\Illuminate\Database\Eloquent\Model>  $model
     * @return array<int>
     */
    private function countRecent(string $model): array
    {
        return collect(range(5, 0))
            ->map(fn (int $monthsAgo): int => $model::query()
                ->whereBetween('created_at', [
                    now()->subMonths($monthsAgo)->startOfMonth(),
                    now()->subMonths($monthsAgo)->endOfMonth(),
                ])
                ->count()
            )
            ->all();
    }
}
