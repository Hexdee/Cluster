import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import brandLogo from "../../assets/icons/brand-logo.svg";
import { closeIcon, hamBurger } from "../../assets/svgs/svg";
import { login, logout } from "../../utils/cluster";
import CustomButton from "../CustomButton/customButton";
import SmallScreenNav from "./smallScreenNav";

const NavBar = () => {
  const [isConnected, setIsConnected] = useState(localStorage.getItem("isDisconnected"));
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState();
  const [aeSdk, setAeSdk] = useState();
  const [isConnecting, setIsConnecting] = useState(false);
  const [displayNav, setDisplayNav] = useState(false);

  const init = async() => {
    if(localStorage.getItem("isConnected")) {
      if(!window.client) {
        await connectWallet(); 
      }
      setIsConnected(true);
      setAddress(localStorage.getItem("isConnected"));
    }
  }

  useEffect(() => {
    init();
  }, [])

  const connectWallet = async() => {
    setIsConnecting(true);
    try {
      const client = await login();
      window.client = client;
      const account = Object.keys(client._accounts.current)[0]
      setAddress(account);
      const accountBalance = (await client.getBalance(account)) / 1e18;
      setBalance(accountBalance);
      setIsConnected(true);
      localStorage.setItem("isConnected", account);
      setIsConnecting(false);
    } catch (err) {
      console.log(err);
      window.alert("Failed to connect wallet!");
      setIsConnecting(false)
      // toast(<NotificationError text="failed to connect wallet"/>)
    }
  }

  const disconnectWallet = async() => {
    setIsConnecting(true);
    try {
      setIsConnected(false);
      window.client = undefined;
      localStorage.removeItem("isConnected");
      setIsConnecting(false);
      await logout();
    } catch (err) {
      console.log(err);
      window.alert("an error occured!");
      setIsConnecting(false);
      // toast(<NotificationError text="an error occured"/>)
    }
  }

  return (
    <Flex
      bg="brand.white"
      p={{ base: "5px 30px", lg: "15px 80px"}}
      alignItems="center"
      justifyContent="space-between"
      fontSize="14px"
      style={{ boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px" }}
      display={{ base: "block", lg: "flex" }}
    >
      <Box mt={{ base: "15px", lg: "0" }} display={{ base: "flex" }} justifyContent="space-between">
        <a href="/">
          <Image cursor="pointer" width={{ base: "100px", lg: "100%" }} src={brandLogo} alt="brand-logo" />
        </a>

        <Box onClick={() => setDisplayNav(!displayNav)} cursor="pointer" display={{ base: "flex", lg: "none" }}>{displayNav ? closeIcon : hamBurger}</Box>
      </Box>

      <Box mt={{ base: "20px", lg: "0" }} display={{ base: "none", lg: "flex" }}>
        {isConnected && <Text>
            Connected user:{" "}
            <span style={{ color: "#A2ADBE" }}>{address.slice(0,35) + "..."}</span>
        </Text>}
      </Box>

      <Box my={{ base: "20px", lg: "0" }} display={{ base: "none", lg: "flex" }}>
        {isConnected ? 
        <CustomButton
        bg="none"
        hoverBg="brand.primary"
        hoverColor="brand.white"
        color="brand.dark"
        border="1px solid #1A202C"
        onClick={() => disconnectWallet()}
        isLoading={isConnecting}
      >
        Disconnect
        </CustomButton> :
        
        <CustomButton
          bg="none"
          hoverBg="brand.primary"
          hoverColor="brand.white"
          color="brand.dark"
          border="1px solid #1A202C"
          onClick={() => connectWallet()}
          isLoading={isConnecting}
        >
          Connect Wallet
        </CustomButton>}
      </Box>

      {displayNav && 
        <SmallScreenNav
        isConnected={isConnected}
        address={address}
        isConnecting={isConnecting}
        disconnectWallet={disconnectWallet}
        connectWallet={connectWallet}
        />
      }
    </Flex>
  );
};

export default NavBar;
