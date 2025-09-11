// lib/utils/articleParser.ts

export interface ParsedArticle {
    title: string;
    subtitle?: string;
    heroImage?: {
        filename: string;
        alt: string;
    };
    intro?: string;
    sections: Array<{
        title: string;
        paragraphs: string[];
        images?: Array<{
            filename: string;
            alt: string;
            caption?: string;
        }>;
    }>;
    breadcrumbs?: {
        category: string;
        subcategory: string;
    };
}

export interface ArticleData {
    contentRAW: string;

}

const stripTags = (input: string): string => {
    // список тегов, которые вырезаем
    const tagsToStrip = ['strong', 'em'];

    let output = input;
    tagsToStrip.forEach(tag => {
        const regex = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 'gi');
        output = output.replace(regex, '$1'); // оставляем только содержимое
    });
    output = output.replace(/\*\*(.*?)\*\*/g, '$1');

    return output;
};

export const parseArticleContent = (articleData?: ArticleData): ParsedArticle | null => {
    if (!articleData) { return null;}
    const { contentRAW } = articleData;
    const content = stripTags(contentRAW);
    const images = parseArticleImages(content);




    // Извлекаем заголовок
    const titleMatch = content.match(/<article-title>([\s\S]*?)<\/article-title>/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    console.log('Title:', title);

    // Извлекаем подзаголовок
    const subtitleMatch = content.match(/<article-subtitle>([\s\S]*?)<\/article-subtitle>/);
    const subtitle = subtitleMatch ? subtitleMatch[1].trim() : undefined;
    console.log('Subtitle:', subtitle);

    // Извлекаем hero изображение
    const heroImageMatch = content.match(/<hero-image filename="(.*?)">([\s\S]*?)<\/hero-image>/);
    let heroImage;
    if (heroImageMatch) {
        const filename = heroImageMatch[1];
        const imageData = images[filename];
        if (imageData) {
            heroImage = {
                filename,
                alt: imageData.alt
            };
        }
    }
    console.log('Hero image:', heroImage);

    // Извлекаем intro
    const introMatch = content.match(/<article-intro>([\s\S]*?)<\/article-intro>/);
    const intro = introMatch ? introMatch[1].trim() : undefined;
    console.log('Intro:', intro);

    // Извлекаем breadcrumbs
    const breadcrumbsMatch = content.match(/breadcrumbs: (.*)/);
    let breadcrumbs;
    if (breadcrumbsMatch) {
        const parts = breadcrumbsMatch[1].split(' > ');
        breadcrumbs = {
            category: parts[1] || '',
            subcategory: parts[2] || ''
        };
    }
    console.log('Breadcrumbs:', breadcrumbs);

    // Извлекаем секции
    const sectionRegex = /<section>([\s\S]*?)<\/section>/g;
    const sections = [];
    let sectionMatch;

    console.log('Starting to parse sections...');

    while ((sectionMatch = sectionRegex.exec(content)) !== null) {
        const sectionContent = sectionMatch[1];
        console.log('Found section content:', sectionContent);

        // Заголовок секции
        const sectionTitleMatch = sectionContent.match(/<section-title>([\s\S]*?)<\/section-title>/);
        const sectionTitle = sectionTitleMatch ? sectionTitleMatch[1].trim() : '';
        console.log('Section title:', sectionTitle);

        // Контент секции
        const sectionContentMatch = sectionContent.match(/<section-content>([\s\S]*?)<\/section-content>/);
        let sectionText = sectionContentMatch ? sectionContentMatch[1].trim() : '';
        console.log('Raw section text:', sectionText);

        // Ищем изображения в секции
        const sectionImages = [];
        const imageRegex = /<content-image filename="(.*?)">([\s\S]*?)<\/content-image>/g;
        let imageMatch;

        while ((imageMatch = imageRegex.exec(sectionText)) !== null) {
            const filename = imageMatch[1];
            const imageContent = imageMatch[2];
            const imageData = images[filename];

            if (imageData) {
                // Извлекаем caption если есть
                const captionMatch = imageContent.match(/<image-caption>([\s\S]*?)<\/image-caption>/);
                const caption = captionMatch ? captionMatch[1].trim() : undefined;

                sectionImages.push({
                    filename,
                    alt: imageData.alt,
                    caption
                });
            }
        }

        // Удаляем теги изображений из текста
        sectionText = sectionText.replace(/<content-image[\s\S]*?<\/content-image>/g, '').trim();
        console.log('Section text after removing images:', sectionText);

        // Парсим абзацы из <p> тегов
        const paragraphMatches = sectionText.match(/<p>([\s\S]*?)<\/p>/g);
        console.log('Paragraph matches found:', paragraphMatches);

        const paragraphs = [];

        if (paragraphMatches && paragraphMatches.length > 0) {
            console.log('Processing <p> tags...');
            for (const pMatch of paragraphMatches) {
                const paragraphContent = pMatch.replace(/<\/?p>/g, '').trim();
                console.log('Extracted paragraph:', paragraphContent);
                if (paragraphContent) {
                    paragraphs.push(paragraphContent);
                }
            }
        } else {
            console.log('No <p> tags found, using fallback split by \\n\\n');
            // Если нет <p> тегов, разбиваем по переносам строк как fallback
            const fallbackParagraphs = sectionText.split('\n\n').filter(p => p.trim());
            paragraphs.push(...fallbackParagraphs.map(p => p.trim()));
        }

        console.log('Final paragraphs for section:', paragraphs);

        sections.push({
            title: sectionTitle,
            paragraphs,
            images: sectionImages.length > 0 ? sectionImages : undefined
        });
    }

    console.log('All sections parsed:', sections);

    const result = {
        title,
        subtitle,
        heroImage,
        intro,
        sections,
        breadcrumbs
    };

    console.log('Final parsed article:', result);

    return result;
};


function parseArticleImages(content: string) {
    const imagesBlockMatch = content.match(/<article-images>([\s\S]*?)<\/article-images>/);

    if (!imagesBlockMatch) return {};

    const imagesContent = imagesBlockMatch[1];
    const imageMatches = imagesContent.match(/<image>([\s\S]*?)<\/image>/g);

    if (!imageMatches) return {};

    const images: Record<string, { filename: string; alt: string }> = {};

    imageMatches.forEach(imageBlock => {
        const filenameMatch = imageBlock.match(/<filename>(.*?)<\/filename>/);
        const altMatch = imageBlock.match(/<alt>(.*?)<\/alt>/);

        if (filenameMatch) {
            const filename = filenameMatch[1].trim();
            images[filename] = {
                filename: filename,
                alt: altMatch ? altMatch[1].trim() : ''
            };
        }
    });

    return images;
}