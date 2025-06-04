"use client";
import React from "react";
import Container from "@/app/components/layouts/Container";
import { GlowingCard } from "@/app/components/ui/animated/GlowingEffect";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FootTypo } from "@/app/components/ui/Typography";
import { BsBoxSeam } from "react-icons/bs";
import { GiShadowFollower } from "react-icons/gi";
import { RiUserFollowLine } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { IoMdHome } from "react-icons/io";
import { GoPackage } from "react-icons/go";
import { MdMiscellaneousServices } from "react-icons/md";
import HomeTab from "../tabs/HomeTab";
import ProductsTab from "../tabs/ProductTab";
import ServicesTab from "../tabs/ServiceTab";
import { useGetProviderBySlug } from "@/app/queries/user/provider.query";
import { ClipLoader } from "react-spinners";
import { useParams } from "next/navigation";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { useFollow, useUnfollow } from "@/app/queries/user/user.query";
import { useGetFollowing } from "@/app/queries/list/follow.list.query";
import { useAddContact } from "@/app/queries/contact/contact.query";
import useChatBox from "@/app/hooks/useChatBox";
import useChat from "@/app/hooks/useChat";
import { motion } from "framer-motion";

const tabs = [
  { icon: IoMdHome, name: "Home", component: HomeTab },
  { icon: GoPackage, name: "Products", component: ProductsTab },
  { icon: MdMiscellaneousServices, name: "Services", component: ServicesTab },
];

const cardVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

const boxVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const StatItem = ({ icon, label, value }) => (
  <motion.div
    variants={boxVariants}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white/5 dark:bg-black/5 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/10 hover:border-white/20 transition-colors"
  >
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gray-100/10">
          {React.cloneElement(icon, {
            className: "w-6 h-6 text-gray-700 dark:text-gray-300",
          })}
        </div>
        <FootTypo
          footlabel={label}
          className="text-base font-medium text-gray-600 dark:text-gray-300"
        />
      </div>
      <FootTypo
        footlabel={value ?? "N/A"}
        className="text-red text-xl font-bold pl-2"
      />
    </div>
  </motion.div>
);

const ProviderDetailPage = () => {
  const { slug } = useParams();
  const { data: provider, isLoading, isError } = useGetProviderBySlug(slug);
  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();
  const { data: followingData, isLoading: followingLoading } =
    useGetFollowing();
  const { onOpen } = useChatBox();
  const { setSelectedReceiver } = useChat();
  const addContactMutation = useAddContact();

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-screen">
          <ClipLoader size={30} />
        </div>
      </Container>
    );
  }

  if (isError || !provider) {
    return (
      <Container>
        <div className="text-center text-red">
          Error loading provider details.
        </div>
      </Container>
    );
  }

  const handleFollowToggle = async (receiverId) => {
    if (!receiverId) {
      console.error("No receiverId provided");
      return;
    }

    if (isProviderFollowed(receiverId)) {
      unfollowMutation.mutate(
        { followingId: receiverId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["following"]);
          },
          onError: (error) => {
            //console.error("Error unfollowing provider:", error);
          },
        }
      );
    } else {
      followMutation.mutate(
        { followingId: receiverId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(["following"]);
          },
          onError: (error) => {
            //console.error("Error following provider:", error);
          },
        }
      );
    }
  };

  const isProviderFollowed = (receiverId) => {
    return followingData?.some(
      (following) => following.accountId === receiverId
    );
  };

  const handleChatClick = (receiver) => {
    const receiverData = {
      contactId: receiver.id,
      contactName: receiver.businessName,
      avatar: receiver.avatar,
    };
    addContactMutation.mutate(receiver.id, {
      onSuccess: () => {
        setSelectedReceiver(receiverData);
        onOpen();
      },
      onError: (error) => {
        console.error("Error adding contact:", error);
      },
    });
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="my-7"
      >
        <MuiBreadcrumbs />
      </motion.div>
      <div className="seller-info py-5 mb-4">
        <section className="pt-5 flex items-start">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <GlowingCard
              icon={
                <Avatar
                  userImg={provider.avatar || ""}
                  w={72}
                  h={72}
                  className="cursor-pointer"
                  isProvider={true}
                  status={provider.providerStatus}
                />
              }
              slug={slug}
              userDetails={provider.businessName}
              className="w-[24rem]"
              onFollowClick={() => handleFollowToggle(provider.id)}
              onChatClick={() => handleChatClick(provider)}
              isFollowed={isProviderFollowed(provider.id)}
              isLoading={
                followMutation.isLoading ||
                unfollowMutation.isLoading ||
                followingLoading
              }
            />
          </motion.div>
          <section className="pl-7 w-full">
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              <StatItem
                icon={<GiShadowFollower />}
                label="Followers"
                value={provider.followersCount}
              />
              <StatItem
                icon={<RiUserFollowLine />}
                label="Following"
                value={provider.followingsCount}
              />
              <StatItem icon={<FaRegStar />} label="Total Rating" value="4" />

              <StatItem
                icon={<LuUsers />}
                label="Become a provider since"
                value={provider.joinedDate}
              />
            </motion.div>
          </section>
        </section>
      </div>

      <motion.div
        className="tabs-pannel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <TabGroup>
          <TabList className="flex gap-base border-b-[1px] pb-9 justify-center">
            {tabs.map(({ name, icon: Icon }) => (
              <Tab
                key={name}
                className="flex items-center gap-2 rounded-full py-1 px-3 font-semibold text-lg focus:outline-none 
                 data-[selected]:border-b-[2px] data-[selected]:border-red
                 data-[hover]:bg-white/5 
                 data-[selected]:data-[hover]:bg-white/10 
                 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                <Icon className="text-xl" /> {name}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="mt-3">
            {tabs.map(({ name, component: Component }) => (
              <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                {name === "Home" ? (
                  <Component
                    phone={provider.phone}
                    address={provider.address}
                    bio={provider.bio}
                    skill={provider.skillName}
                    pastWorkPlaces={provider.pastWorkPlaces}
                    pastProjects={provider.pastProjects}
                    certificateImageUrls={provider.certificateImageUrls}
                  />
                ) : (
                  <Component providerId={provider.id} />
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </motion.div>
    </Container>
  );
};

export default ProviderDetailPage;
