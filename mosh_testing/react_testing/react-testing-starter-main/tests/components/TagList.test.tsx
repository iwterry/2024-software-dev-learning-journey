import { render, screen, waitFor } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe('TagList', () => {
  it('should render tags', async () => {
    render(<TagList />);

    // two options for testing a component that uses asynchronous code
    // option 1
    // await waitFor(() => {
    //   const listItems = screen.getAllByRole('listitem');
    //   expect(listItems.length).toBeGreaterThan(0);
    // })

    // NOTE: waitFor keeps calling the callback until it times out

    // option 2
    const listItems = await screen.findAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
  
    
  })
})