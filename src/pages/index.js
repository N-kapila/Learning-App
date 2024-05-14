// @mui
import { styled } from "@mui/material/styles";
// layouts
import Layout from "../layouts";
// components
import Page from "../components/Page";
// sections
import {
  HomeHero,
  HomeMinimal,
  HomeDarkMode,
  HomeLookingFor,
  HomeColorPresets,
  HomePricingPlans,
  HomeAdvertisement,
  HomeCleanInterfaces,
  HomeHugePackElements,
} from "../sections/home";
import Register from "./auth/register";

// ----------------------------------------------------------------------

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

HomePage.getLayout = function getLayout(page) {
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function HomePage() {
  console.log(process.env.NODE_ENV);
  console.log(process.env.CHATA_ENV ? process.env.CHATA_ENV : "not found");
  return (
    <Page title="The starting point for your next project">
      <Register />

      {/* <ContentStyle>
        <HomeMinimal />

        <HomeHugePackElements />

        <HomeDarkMode />

        <HomeColorPresets />

        <HomeCleanInterfaces />

        <HomePricingPlans />

        <HomeLookingFor />

        <HomeAdvertisement />
      </ContentStyle> */}
    </Page>
  );
}
