<?php

namespace App\Filament\Resources\BlogPosts\Schemas;

use App\Support\CloudinaryUrl;
use Filament\Forms\Components\BaseFileUpload;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class BlogPostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // ─── Main Content ────────────────────────────
                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (string $state, callable $set) {
                        $set('slug', Str::slug($state));
                    }),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true)
                    ->helperText('URL-friendly version of the title. Auto-generated from title.'),

                Select::make('category')
                    ->options([
                        'Technology' => 'Technology',
                        'Tutorial' => 'Tutorial',
                        'Career' => 'Career',
                        'Web Development' => 'Web Development',
                        'DevOps' => 'DevOps',
                        'AI & ML' => 'AI & ML',
                        'Personal' => 'Personal',
                        'Other' => 'Other',
                    ])
                    ->searchable()
                    ->createOptionForm([
                        TextInput::make('category')
                            ->required(),
                    ])
                    ->createOptionUsing(function (array $data): string {
                        return $data['category'];
                    }),

                Textarea::make('excerpt')
                    ->rows(3)
                    ->maxLength(300)
                    ->helperText('Brief summary shown on blog cards and used as default meta description (max 300 chars).')
                    ->columnSpanFull(),

                MarkdownEditor::make('content')
                    ->required()
                    ->columnSpanFull()
                    ->fileAttachmentsDisk('cloudinary')
                    ->fileAttachmentsDirectory('blog-images')
                    ->helperText('Write your blog post in Markdown/MDX format. Supports headings, bold, italic, code blocks, images, links, and lists.'),

                FileUpload::make('featured_image')
                    ->label('Featured Image')
                    ->image()
                    ->directory('blog')
                    ->disk('cloudinary')
                    ->visibility('public')
                    ->fetchFileInformation(false)
                    ->getUploadedFileUsing(static fn (BaseFileUpload $component, string $file, string|array|null $storedFileNames): array => [
                        'name' => ($component->isMultiple() ? ($storedFileNames[$file] ?? null) : $storedFileNames) ?? basename($file),
                        'size' => 0,
                        'type' => null,
                        'url' => CloudinaryUrl::image($file),
                    ])
                    ->imageEditor()
                    ->maxSize(5120) // 5MB
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
                    ->helperText('Hero image for the blog post (max 5MB). Recommended: 1200×630px for optimal social sharing.')
                    ->columnSpanFull(),

                TagsInput::make('tags')
                    ->placeholder('Add tag (press Enter)')
                    ->helperText('Tags for filtering and SEO.')
                    ->columnSpanFull(),

                // ─── Publishing Options ──────────────────────
                Toggle::make('is_published')
                    ->label('Published')
                    ->helperText('Toggle to make the post publicly visible.'),

                Toggle::make('is_featured')
                    ->label('Featured')
                    ->helperText('Featured posts appear in the highlighted section.'),

                DatePicker::make('published_at')
                    ->label('Publish Date')
                    ->helperText('Schedule a future publish date, or leave empty to publish immediately when toggled on.'),

                TextInput::make('display_order')
                    ->numeric()
                    ->default(0)
                    ->helperText('Lower numbers appear first. Use 0 for default ordering by date.'),

                TextInput::make('reading_time')
                    ->numeric()
                    ->disabled()
                    ->dehydrated(false)
                    ->helperText('Auto-calculated from content length (~200 words/min). Saved automatically.'),

                // ─── SEO Section ─────────────────────────────
                Section::make('SEO Settings')
                    ->description('Optimize how this post appears in search results and social shares.')
                    ->collapsed()
                    ->columns(1)
                    ->schema([
                        TextInput::make('meta_title')
                            ->label('Meta Title')
                            ->maxLength(70)
                            ->helperText('Custom title for search engines (max 70 chars). Falls back to post title if empty.'),

                        Textarea::make('meta_description')
                            ->label('Meta Description')
                            ->maxLength(160)
                            ->rows(2)
                            ->helperText('Custom description for search results (max 160 chars). Falls back to excerpt if empty.'),

                        TextInput::make('meta_keywords')
                            ->label('Meta Keywords')
                            ->maxLength(255)
                            ->helperText('Comma-separated keywords (optional, minor SEO impact).'),

                        FileUpload::make('og_image')
                            ->label('Social Share Image (OG Image)')
                            ->image()
                            ->directory('blog-og')
                            ->disk('cloudinary')
                            ->visibility('public')
                            ->fetchFileInformation(false)
                            ->getUploadedFileUsing(static fn (BaseFileUpload $component, string $file, string|array|null $storedFileNames): array => [
                                'name' => ($component->isMultiple() ? ($storedFileNames[$file] ?? null) : $storedFileNames) ?? basename($file),
                                'size' => 0,
                                'type' => null,
                                'url' => CloudinaryUrl::image($file),
                            ])
                            ->maxSize(2048) // 2MB
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->helperText('Custom image for social media sharing. Falls back to featured image if empty. Recommended: 1200×630px.'),
                    ]),
            ]);
    }
}
