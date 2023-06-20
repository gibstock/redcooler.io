import api from "@/api/api"

type ImageList = {
  $id: string,
}[]| null

// GOAL:
// Have a map where the key is the image id 
// and the value is the url
// The url can be obtained by running getAvatarById
// and passing in the image id
// so here we should map through the imageList,
// get the url by calling getAvatarById and then setting the 
// key/value pairs with the returned url

export const imageMap = (imageList: ImageList | null) => {
  const imageMap = new Map<string, string>()

  imageList && imageList.forEach(async(img) => {
    const imageUrl = await api.getAvatarById(img.$id);
    imageMap.set(img.$id, imageUrl.href)
  })

  return imageMap;

}