import cloudinary from "./cloudinary";

interface CloudinaryResource {
  height: string;
  width: string;
  public_id: string;
  format: string;
}

interface Cloudinary {
  resources: Array<CloudinaryResource>;
}

let cachedResults: Cloudinary;

export default async function getResults() {
  if (!cachedResults) {
    const fetchedResults = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    cachedResults = fetchedResults;
  }

  return cachedResults;
}
