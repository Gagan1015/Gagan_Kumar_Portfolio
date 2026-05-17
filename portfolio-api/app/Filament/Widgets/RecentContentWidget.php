<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class RecentContentWidget extends TableWidget
{
    protected static ?int $sort = -2;

    protected int|string|array $columnSpan = [
        'default' => 1,
        'lg' => 1,
    ];

    public function table(Table $table): Table
    {
        return $table
            ->heading('Recent Blog Updates')
            ->query(fn (): Builder => BlogPost::query()->latest('updated_at'))
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->limit(42)
                    ->weight('medium'),
                TextColumn::make('category')
                    ->badge()
                    ->placeholder('Uncategorized'),
                IconColumn::make('is_published')
                    ->label('Live')
                    ->boolean(),
                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->since()
                    ->sortable(),
            ])
            ->defaultPaginationPageOption(5)
            ->paginated([5, 10]);
    }
}
