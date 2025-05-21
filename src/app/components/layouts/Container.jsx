import { Container as MuiContainer } from "@mui/material";

const Container = ({ children }) => {
  return (
    <MuiContainer maxWidth="xl" className="relative pt-28">
      {children}
    </MuiContainer>
  );
};

export default Container;
