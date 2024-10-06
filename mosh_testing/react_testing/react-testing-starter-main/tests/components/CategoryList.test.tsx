import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import CategoryList from "../../src/components/CategoryList";
import ReduxProvider from "../../src/providers/ReduxProvider";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { categories as intialCategeories } from "../mocks/data";

describe('CategoryList', () => {
  const categories = intialCategeories;

  beforeEach(() => {
    server.use(http.get('/categories', () => HttpResponse.json(categories)));
  })

  afterEach(() => {
    server.resetHandlers();
  })

  const renderCategoryList = () => {
    render(
      <ReduxProvider>
        <CategoryList />
      </ReduxProvider>
    )
  }

  it('should render heading', () => {
    renderCategoryList();

    const heading = screen.getByRole('heading', { name: /category list/i });
    expect(heading).toBeInTheDocument();
  })

  it('should render loading message when fetching categories', () => {
    server.use(http.get('/categories', async () => {
      await delay();
      return HttpResponse.json(categories);
    }));

    renderCategoryList();

    const loadingText = screen.getByText('loading', { exact: false });
    expect(loadingText).toBeInTheDocument();
  })

  it('should not render loading message after categories has been fetched', async () => {
    renderCategoryList();


    await waitForElementToBeRemoved(() => screen.getByText('loading', { exact: false }))

    const loadingText = screen.queryByText('loading', { exact: false });
    expect(loadingText).not.toBeInTheDocument();
  })

  it('should not render loading message after errors occurs when trying to fetch categories', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()));

    
    renderCategoryList();

    await waitForElementToBeRemoved(() => screen.getByText('loading', { exact: false }))

    const loadingText = screen.queryByText('loading', { exact: false });
    expect(loadingText).not.toBeInTheDocument();
  })

  it('should render error message when an errors occurs when trying to fetch categories', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()));


    renderCategoryList();


    await waitForElementToBeRemoved(() => screen.getByText('loading', { exact: false }))

    const errorText = screen.getByText('error', { exact: false });
    expect(errorText).toBeInTheDocument();
  })

  it('should render categories after fetching successfully fetching categories', async () => {
    renderCategoryList();


    await waitForElementToBeRemoved(() => screen.getByText('loading', { exact: false }))


    categories.forEach(({ name }) => {
      const category = screen.getByText(name, { exact: false });
      expect(category).toBeInTheDocument();
      expect(category).toHaveRole('listitem');
    });
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(categories.length);
  })
})