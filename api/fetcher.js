import axios from 'axios';
import cheerio from 'cheerio';

const mainUrl = 'https://wallpaper.mob.org/';
var fetchUrl = ""
var searchUrl = ""
let Page = 1;
let SearchPage = 1;
let seeAll = 2

export async function see_all(tag,page) {
    const fetch_url = page > 1 ? `${mainUrl}/gallery/tag=${tag}/${page}/` : `${mainUrl}/gallery/tag=${tag}/`;
    try {
        const response = await axios.get(fetch_url);
        const $ = cheerio.load(response.data);
        const containers = $(".image-gallery__items.image-gallery-items-container");
        let imageLinks = [];
        containers.each((index, container) => {
            const images = $(container).find("img");
            images.each((i, image) => {
                imageLinks.push($(image).attr('src') + "?h=450&r=0.5");
            });
        });
        return imageLinks;
    } catch (error) {
        
        return error;
    }
}


export async function get_images(tag, page) {
    fetchUrl = page > 1 ? `${mainUrl}/gallery/tag=${tag}/${page}/` : `${mainUrl}/gallery/tag=${tag}/`;
    try {
        const response = await axios.get(fetchUrl);
        const $ = cheerio.load(response.data);
        const containers = $(".image-gallery__items.image-gallery-items-container");
        const imageLinks = [];

        containers.each((index, container) => {
            const images = $(container).find("img");
            images.each((i, x) => {
                const parentATag = "https:" + $(x).parent("a").attr("href");
                const image = $(x).attr('src') + "?h=450&r=0.5";
                
                imageLinks.push({
                    Image_url: parentATag,
                    Image: image
                });
            });
        });

        return imageLinks;
    } catch (error) {
        console.error("Error", error);
        return error;
    }
}

export async function get_images_search(tag) {
    if (tag.endsWith(' ')) {
        tag = tag.substring(0, tag.length - 1);
      }
    searchUrl = `${mainUrl}/gallery/tag=${tag}/`;
    try {
        const response = await axios.get(searchUrl,{
            timeout: 5000 // Timeout in milliseconds (5000ms = 5 seconds)
          });
        const $ = cheerio.load(response.data);
        const containers = $(".image-gallery__items.image-gallery-items-container");
        const imageLinks = [];

        containers.each((index, container) => {
            const images = $(container).find("img");
            images.each((i, x) => {
                const parentATag = "https:" + $(x).parent("a").attr("href");
                const image = $(x).attr('src') + "?h=450&r=0.5";
                
                imageLinks.push({
                    Image_url: parentATag,
                    Image: image
                });
            });
        });

        return imageLinks;
    } catch (error) {
        return error;
    }
}

export async function getSimilarTags(mainUrl) {
    try {
        const response = await axios.get(mainUrl);
        const html = response.data;
        const $ = cheerio.load(html);
        const similarTags = [];
        
        const containers = $('.container-2 .page-image__top-tags .tag-widgets');
        const cardItems = containers.first().find('.tag-widgets__item');

        cardItems.each((index, item) => {
            const holder = $(item).find('a');
            const url = 'https:' + holder.attr('href');
            const title = holder.find('.tag-widget__title').text().trim();
            const images = holder.find('.tag-widget__images');
            const mainImage = images.find('.tag-widget__big-image-block img').attr('src');
            const smallImagesContainer = images.find('.tag-widget__small-images-block .tag-widget__small-images-item');
            const smallImage1 = smallImagesContainer.eq(0).find('img').attr('src');
            const smallImage2 = smallImagesContainer.eq(1).find('img').attr('src');

            similarTags.push({
                Title: title,
                Url: url,
                Image1: mainImage,
                Image2: smallImage1,
                Image3: smallImage2
            });
        });

        return similarTags;
    } catch (error) {
        return error;
    }
}

export async function getSimilarImages(url) {
    let SimilarImages = [];
    try {
        const data = await axios.get(url);
        const $ = cheerio.load(data);
        const Container = $('.container-2');
        const holder = Container.eq(3).find('.image-gallery-items');
        const Items = holder.find('.image-gallery-items__item');

        Items.each((index, element) => {
            const item = $(element);
            const image = item.find('.image-gallery-image img').attr('src');
            const imageUrl = "https:" + item.find('.image-gallery-image .image-gallery-image__inner').attr('href');
            
            SimilarImages.push({ Image: image, ImageUrl: imageUrl });
        });

        return SimilarImages;
    } catch (error) {
        console.error("An Error Occurred:\n", error);
        return error;
    }
}

export async function getRelatedTags(mainUrl) {
    let relatedTags = [];
    try {
        const data = await axios.get(mainUrl);
        const $ = cheerio.load(data);
        const Tagscontainer = $('.page-image__gallery-tags .page-image__gallery-tags-item');

        Tagscontainer.each((index, element) => {
            const tag = $(element).text().trim();
            relatedTags.push(tag);
        });

        return relatedTags;
    } catch (error) {
        return error;
    }
}