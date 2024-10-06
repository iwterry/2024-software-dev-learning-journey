import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe('ProductImageGallery', () => {
  it('should return null when the image urls array is empty', () => {
    const imageUrls: string[] = [];

   const { container } = render(<ProductImageGallery imageUrls={imageUrls}/>);

   expect(container).toBeEmptyDOMElement();
  })

  it('should render a list of images when the image urls array is non-empty', () => {
    const imageUrls: string[] = [
      '/images/image-1.jpg',
      '/images/image-2.jpg'
    ];


    render(<ProductImageGallery imageUrls={imageUrls}/>);


    const images:HTMLImageElement[] = screen.getAllByRole('img');
    expect(images).toHaveLength(2);

    const imagesFoundForImage1 = images.filter((image) => image.getAttribute('src') === imageUrls[0]);
    expect(imagesFoundForImage1).toHaveLength(1);

    const imagesFoundForImage2 = images.filter((image) => image.getAttribute('src') === imageUrls[1]);
    expect(imagesFoundForImage2).toHaveLength(1);
  })
})