import { Box, Divider, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import HeadTag from "../components/Common/headTag";
import CustomButton from "../components/CustomButton/customButton";
import NavBar from "../components/Navbar/navbar";
import { clusterAddress, getDA0s, getDAODetails } from "../utils/cluster";


const Home = () => {
    const [viewAllDAO, setViewAllDAO] = useState(false);
    const [DAOs, setDAOs] = useState([]);

  async function init() {
      await getAllDAOs();
  }

  const getAllDAOs = async () => {
    try {
      let f = localStorage.getItem('DAOs');
      if (f) {
        setDAOs(JSON.parse(f));
      }
      getDA0s().then((res) => {
        //Convert BigInts to string before storing locally
        res = res.map((d) => {
          d.id = d.id.toString();
          d.created_at = d.created_at.toString();
          return d;
        });
        setDAOs(res);
        localStorage.setItem("daos", JSON.stringify(res));
      })
      // //Update user balance if connected
      // if(aeSdk) {
      //   const accountBalance = (await aeSdk.getBalance(user)) / 1e18;
      //   setBalance(accountBalance);
      // }
    } catch (error) {
      console.log({ error });
      window.alert("failed to get DAOs");
      // toast(<NotificationError text="failed to get daos"/>)
    };
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <Box>
      <HeadTag title="View Demo" />
      <NavBar />
      <Box mt="40px" width="100%" m="30px auto" textAlign="center">
        <Box mx="auto">
          <CustomButton
            bg="brand.primary"
            hoverBg="brand.white"
            hoverColor="brand.primary"
            color="brand.white"
            border="1px solid #FAF9F7"
            w={{ base: "80%", lg: "30%"}}
            mx="auto"
            href="/create-dao"
          >
            Create a new DAO
          </CustomButton>
        </Box>
        <Box>
          <CustomButton
            bg="none"
            hoverBg="brand.primary"
            hoverColor="brand.white"
            color="brand.dark"
            border="1px solid #1A202C"
            w={{ base: "80%", lg: "30%"}}
            m="20px 0"
            mx="auto"
            onClick={() => setViewAllDAO(!viewAllDAO)}
          >
            View all DAOs
          </CustomButton>
        </Box>
      </Box>

        {viewAllDAO &&
        <Box my="10px">
            {DAOs.length < 1 ? (
            <Text textAlign="center">You have no DAO yet. Start by creating a 
            <a href="/create-dao"><span style={{ color: "#1C1CFF", cursor: "pointer", marginLeft: "8px" }}>new DAO</span></a></Text>
            ) : (
        <SimpleGrid columns={{ base: 1, lg: 3 }} mt="30" gap="20px" p={{ base: "5px 30px", lg: "15px 80px"}}>
            {DAOs.map((dao, index) => (
                <Box
                    padding="10px 20px"
                    mt="20px"
                    borderRadius="8px"
                    style={{
                    boxShadow:
                        "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                    }}
                    w={{ base: "100%", lg: "80%"}}
                    bg="white"
                    border=""
                    p="20px"
                    key={index}
                >
                    <Text color="brand.primary" fontWeight="bold" fontSize="22px">
                    {dao.name}
                    </Text>
                    <Divider my="10px" />
                    {/* <Flex justifyContent="space-between" mt="10px">
                    <Text>Amount:</Text>
                    <Text ml="10px" color="brand.gray">
                        {dao.amount}
                    </Text>
                    </Flex>
                    <Flex justifyContent="space-between" mt="10px">
                    <Text>Total member: </Text>
                    <Text ml="10px" color="brand.gray">
                        {dao.member} members
                    </Text>
                    </Flex> */}
                    <Flex justifyContent="space-between" mt="10px">
                    <Text>Date Created: </Text>
                    <Text ml="10px" color="brand.gray">
                        {(new Date(dao.created_at * 1)).toLocaleDateString()}
                    </Text>
                    </Flex>
                    <Flex justifyContent="space-between" mt="10px">
                    <Text>Creator: </Text>
                    <Text ml="10px" color="brand.gray">
                        {dao.creator.slice(0, 13) + "..."}
                    </Text>
                    </Flex>
                    {/* <Text mt="15px" color="brand.primary" fontSize="14px">
                        {dao.isOwned ? "DAO created by me" : "Not owned"}
                    </Text> */}
                    <CustomButton
                    bg="none"
                    hoverBg="brand.primary"
                    hoverColor="brand.white"
                    color="brand.dark"
                    border="1px solid #1A202C"
                    mt="10px"
                    href={`/dao/${dao.id}`}
                    >
                    View DAO
                    </CustomButton>
                </Box>
            ))}
        </SimpleGrid>
            )}
        </Box>
        }
    </Box>
  );
};

export default Home;
