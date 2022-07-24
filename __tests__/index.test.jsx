import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Home from '../pages/index.js'

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
    };
  },
}));

describe('Main page', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });


  afterEach(cleanup);

  it('renders header', () => {
    render(
      <Home />
    )

    const heading = screen.getByRole('heading', {
      name: 'Spotlight Wallpapers',
    })

    console.log('heading', heading);
    expect(heading).toBeInTheDocument()
  })

  it('renders list', () => {
    render(
      <Home />
    )

    const list = document.querySelector('.photoGrid'); 

    console.log('list', list);
    expect(list).toBeInTheDocument()
  })
})
