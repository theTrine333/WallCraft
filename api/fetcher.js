import axios from "axios";
import cheerio from "react-native-cheerio";

const mainUrl = "https://wallpaper.mob.org/";
let fetchUrl = "";
let searchUrl = "";

export async function see_all(tag, page) {
  const fetch_url =
    page > 1
      ? `${mainUrl}/gallery/tag=${tag}/${page}/`
      : `${mainUrl}/gallery/tag=${tag}/`;
  try {
    const response = await axios.get(fetch_url);
    const $ = cheerio.load(response.data);
    const containers = $(".image-gallery__items.image-gallery-items-container");
    let imageLinks = [];
    containers.each((index, container) => {
      const images = $(container).find("img");
      images.each((i, image) => {
        imageLinks.push($(image).attr("src") + "?h=450&r=0.5");
      });
    });
    return imageLinks;
  } catch (error) {
    return error;
  }
}

export async function get_images(tag, page) {
  fetchUrl =
    page > 1
      ? `${mainUrl}/gallery/tag=${tag}/${page}/`
      : `${mainUrl}/gallery/tag=${tag}/`;
  try {
    const response = await axios.get(fetchUrl);
    const $ = cheerio.load(response.data);
    const containers = $(".image-gallery__items.image-gallery-items-container");
    const imageLinks = [];

    containers.each((index, container) => {
      const images = $(container).find("img");
      images.each((i, x) => {
        const parentATag = "https:" + $(x).parent("a").attr("href");
        const image = $(x).attr("src") + "?h=450&r=0.5";

        imageLinks.push({
          Image_url: parentATag,
          Image: image,
        });
      });
    });
    const uniqueImages = [
      ...new Map(
        imageLinks.map((img) => [img.Image_url, img]) // Use Image_url as key
      ).values(),
    ];

    return uniqueImages;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
}

export async function getSimilarTags(mainUrl) {
  try {
    const response = await axios.get(mainUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const similarTags = [];

    const containers = $(".container-2 .page-image__top-tags .tag-widgets");
    const cardItems = containers.first().find(".tag-widgets__item");

    cardItems.each((index, item) => {
      const holder = $(item).find("a");
      const url = "https:" + holder.attr("href");
      const title = holder.find(".tag-widget__title").text().trim();
      const images = holder.find(".tag-widget__images");
      const mainImage = images
        .find(".tag-widget__big-image-block img")
        .attr("src");
      const smallImagesContainer = images.find(
        ".tag-widget__small-images-block .tag-widget__small-images-item"
      );
      const smallImage1 = smallImagesContainer.eq(0).find("img").attr("src");
      const smallImage2 = smallImagesContainer.eq(1).find("img").attr("src");

      similarTags.push({
        Title: title,
        Url: url,
        Image1: mainImage,
        Image2: smallImage1,
        Image3: smallImage2,
      });
    });

    return similarTags;
  } catch (error) {
    return error;
  }
}

export async function getSearch(word, setData) {
  await fetch("https://wallpaper.mob.org/xrequest/search/", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      priority: "u=1, i",
      "sec-ch-ua": '"Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      Referer: "https://wallpaper.mob.org/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `razdel=pic&search_word=${word}&offset=0&limit=15&pc=`,
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      setData(data);
    });
}

export async function get_images_search(tag) {
  if (tag.endsWith(" ")) {
    tag = tag.substring(0, tag.length - 1);
  }
  searchUrl = `${mainUrl}/gallery/tag=${tag}/`;
  try {
    const response = await axios.get(searchUrl, {
      timeout: 5000, // Timeout in milliseconds (5000ms = 5 seconds)
    });
    const $ = cheerio.load(response.data);
    const containers = $(".image-gallery__items.image-gallery-items-container");
    const imageLinks = [];

    containers.each((index, container) => {
      const images = $(container).find("img");
      images.each((i, x) => {
        const parentATag = "https:" + $(x).parent("a").attr("href");
        const image = $(x).attr("src") + "?h=450&r=0.5";

        imageLinks.push({
          Image_url: parentATag,
          Image: image,
        });
      });
    });

    return imageLinks;
  } catch (error) {
    return error;
  }
}

export function extractTags(String) {
  const url = `${String}`;
  const startIdx = url.indexOf("=") + 1;
  const endIdx = url.length - 1;
  const extractedWord = url.substring(startIdx, endIdx);

  return extractedWord;
}
