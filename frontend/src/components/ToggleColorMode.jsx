import { useColorMode } from "@chakra-ui/color-mode";
import { Button } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ToggleColorMode = ({ position }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      onClick={() => toggleColorMode()}
      position={position === undefined ? "static" : position}
      top={position === "absolute" ? "0" : undefined}
      right={position === "absolute" ? "0" : undefined}
      m="1rem"
    >
      {colorMode === "dark" ? <SunIcon color="orange.400"/> : <MoonIcon color="blue.800"/>}
    </Button>
  );
};

export default ToggleColorMode;
