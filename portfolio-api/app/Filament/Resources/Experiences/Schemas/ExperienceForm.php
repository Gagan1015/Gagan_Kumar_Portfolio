<?php

namespace App\Filament\Resources\Experiences\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ExperienceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('company')
                    ->required(),
                TextInput::make('position')
                    ->required(),
                TextInput::make('location')
                    ->default(null),
                Select::make('employment_type')
                    ->options([
            'full_time' => 'Full time',
            'part_time' => 'Part time',
            'contract' => 'Contract',
            'freelance' => 'Freelance',
        ])
                    ->default('full_time')
                    ->required(),
                DatePicker::make('start_date')
                    ->required(),
                DatePicker::make('end_date'),
                Toggle::make('is_current')
                    ->required(),
                Textarea::make('description')
                    ->default(null)
                    ->columnSpanFull(),
                TagsInput::make('responsibilities')
                    ->placeholder('Add responsibility (press Enter)')
                    ->columnSpanFull(),
                TagsInput::make('technologies')
                    ->placeholder('Add technology (press Enter)')
                    ->columnSpanFull(),
                TextInput::make('company_logo')
                    ->default(null),
                TextInput::make('website_url')
                    ->url()
                    ->default(null),
                TextInput::make('display_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_published')
                    ->required(),
            ]);
    }
}
