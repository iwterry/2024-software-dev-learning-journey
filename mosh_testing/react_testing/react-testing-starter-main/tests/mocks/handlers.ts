import { http, HttpResponse } from 'msw';
import { categories, products } from './data';


export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json(categories)
  }),

  http.get('/products', () => {
    return HttpResponse.json(
      Array.from(products, ([_, product]) => product)
    )
  }),

  http.get('/products/:id', ({ params }) => {
    const { id } = params;

    const product = products.get(Number.parseInt(id as string)) || null

    if (!product) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json(product);
  })
];