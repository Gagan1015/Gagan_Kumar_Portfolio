<?php

namespace App\Filament\Resources\Projects\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                TextInput::make('category')
                    ->default(null),
                Textarea::make('description')
                    ->default(null)
                    ->columnSpanFull(),
                Textarea::make('long_description')
                    ->default(null)
                    ->columnSpanFull(),
                FileUpload::make('image_url')
                    ->label('Project Image')
                    ->image()
                    ->directory('projects')
                    ->disk('cloudinary')
                    ->visibility('public')
                    ->imageEditor()
                    ->maxSize(5120) // 5MB
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
                    ->helperText('Upload a project image (max 5MB)'),
                TagsInput::make('gallery_images')
                    ->placeholder('Add image URL (press Enter)')
                    ->columnSpanFull(),
                TagsInput::make('technologies')
                    ->placeholder('Add technology (press Enter)')
                    ->columnSpanFull(),
                TagsInput::make('features')
                    ->placeholder('Add feature (press Enter)')
                    ->columnSpanFull(),
                TextInput::make('github_url')
                    ->url()
                    ->default(null),
                TextInput::make('demo_url')
                    ->url()
                    ->default(null),
                TextInput::make('website_url')
                    ->url()
                    ->default(null),
                DatePicker::make('start_date'),
                DatePicker::make('end_date'),
                TextInput::make('client')
                    ->default(null),
                TextInput::make('role')
                    ->default(null),
                TextInput::make('status')
                    ->default(null),
                Toggle::make('is_featured')
                    ->required(),
                TextInput::make('display_order')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_published')
                    ->required(),
                TextInput::make('meta_title')
                    ->default(null),
                Textarea::make('meta_description')
                    ->default(null)
                    ->columnSpanFull(),
            ]);
    }
}
