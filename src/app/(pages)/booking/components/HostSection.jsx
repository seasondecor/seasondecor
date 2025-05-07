"use client";

import Link from "next/link";
import { FootTypo } from "@/app/components/ui/Typography";
import { BorderBox } from "@/app/components/ui/BorderBox";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { Divider } from "@mui/material";
import { MdVerifiedUser } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaVideo, FaCalendarAlt, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const HostSection = ({ href = "", avatar, name, joinDate, followers }) => {
  return (
    <div className="border-t py-10 flex flex-col">
      <FootTypo
        footlabel="Meet Provider"
        className="!m-0 text-xl font-semibold pb-5"
      />
      <div className="w-full flex flex-col md:flex-row gap-6 items-start">
        <BorderBox className="w-full md:w-2/5 shadow-xl">
          <Link
            href={href}
            className="flex flex-row gap-4 justify-between items-center"
          >
            <div className="flex flex-col items-center gap-1 w-2/3">
              <div className="relative inline-block">
                <div className="rounded-full p-1.5 bg-gradient-to-r from-primary to-white">
                  <div className="rounded-full overflow-hidden">
                    <Avatar userImg={avatar} w={104} h={104} />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white border-2 border-white shadow-md">
                  <MdVerifiedUser size={20} />
                </div>
              </div>
              <FootTypo
                footlabel={name}
                className="!m-0 text-xl font-bold mt-2"
              />
            </div>
            <div className="flex flex-col items-center gap-2 w-1/3">
              <div className="flex flex-col self-start">
                <FootTypo
                  footlabel={joinDate}
                  className="!m-0 text-lg font-semibold"
                />
                <FootTypo footlabel="Join date" className="!m-0 text-sm" />
              </div>
              <Divider
                variant="fullWidth"
                className=" dark:bg-gray-500"
                flexItem
              />
              <div className="flex flex-col self-start">
                <FootTypo
                  footlabel={followers}
                  className="!m-0 text-lg font-semibold"
                />
                <FootTypo footlabel="Followers" className="!m-0 text-sm" />
              </div>
            </div>
          </Link>
        </BorderBox>

        <div className="flex flex-col gap-6 w-full md:w-3/5">
          <BorderBox>
            <FootTypo
              footlabel="Platform Integration Features"
              className="!m-0 text-base font-semibold mb-3"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <IoChatboxEllipsesOutline
                    className="text-green-600 dark:text-green-400"
                    size={18}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Real-time Chat</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Instant communication
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                  <FaCalendarAlt
                    className="text-purple-600 dark:text-purple-400"
                    size={18}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Schedule Meeting</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Book time with provider
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                  <FaStar
                    className="text-amber-600 dark:text-amber-400"
                    size={18}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Premium Support</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Priority assistance
                  </p>
                </div>
              </motion.div>
            </div>
          </BorderBox>
        </div>
      </div>
    </div>
  );
};

export default HostSection;
