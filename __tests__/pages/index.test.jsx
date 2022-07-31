import { render, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Home from '../../pages/index.js'
import { MOCKS } from '../../utils/mocks'

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

    expect(heading).toBeInTheDocument()
  })

  it('renders list of given photos', async () => {
    const { findAllByTestId } = render(
      <Home photos={MOCKS.PHOTOS.slice(0, 3)}/>
    )

   const list = await findAllByTestId('photo-card'); 
   expect(list).toHaveLength(3);
  })
})
