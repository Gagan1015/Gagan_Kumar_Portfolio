<?php

namespace App\Filament\Resources\Profiles\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ProfileForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('full_name')
                    ->required(),
                TextInput::make('title')
                    ->required(),
                Textarea::make('bio')
                    ->default(null)
                    ->columnSpanFull(),
                Textarea::make('summary')
                    ->default(null)
                    ->columnSpanFull(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('phone')
                    ->tel()
                    ->default(null),
                TextInput::make('location')
                    ->default(null),
                TextInput::make('avatar')
                    ->default(null),
                TextInput::make('resume_url')
                    ->label('Resume URL')
                    ->url()
                    ->default(null)
                    ->helperText('Direct URL to your resume PDF'),
                TextInput::make('github_url')
                    ->url()
                    ->default(null),
                TextInput::make('linkedin_url')
                    ->url()
                    ->default(null),
                TextInput::make('twitter_url')
                    ->url()
                    ->default(null),
                TextInput::make('website_url')
                    ->url()
                    ->default(null),
                TextInput::make('years_of_experience')
                    ->numeric()
                    ->default(null),
                Select::make('availability_status')
                    ->options(['available' => 'Available', 'busy' => 'Busy', 'not_available' => 'Not available'])
                    ->default('available')
                    ->required(),
                TextInput::make('meta_title')
                    ->default(null),
                Textarea::make('meta_description')
                    ->default(null)
                    ->columnSpanFull(),
            ]);
    }
}
