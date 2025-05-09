"use client";
import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/app/utils/Utils";
import { animate } from "motion/react";
import clsx from "clsx";
import Button from "../Buttons/Button";
import { FaPlus } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useUser } from "@/app/providers/userprovider";
import { FootTypo } from "../Typography";
import Link from "next/link";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { Skeleton } from "@mui/material";


const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 2,
    disabled = true,
  }) => {
    const containerRef = useRef(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef(0);

    const handleMove = useCallback(
      (e) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={{
            "--blur": `${blur}px`,
            "--spread": spread,
            "--start": "0",
            "--active": "0",
            "--glowingeffect-border-width": `${borderWidth}px`,
            "--repeating-conic-gradient-times": "5",

            "--gradient":
              variant === "white"
                ? `repeating-conic-gradient(
              from 236.84deg at 50% 50%,
              var(--black),
              var(--black) calc(25% / var(--repeating-conic-gradient-times))
            )`
                : `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
            radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
            radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%), 
            radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
            repeating-conic-gradient(
              from 236.84deg at 50% 50%,
              #dd7bbb 0%,
              #d79f1e calc(25% / var(--repeating-conic-gradient-times)),
              #5a922c calc(50% / var(--repeating-conic-gradient-times)), 
              #4c7894 calc(75% / var(--repeating-conic-gradient-times)),
              #dd7bbb calc(100% / var(--repeating-conic-gradient-times))
            )`,
          }}
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)] ",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };

export const GlowingCard = ({
  id,
  icon,
  userDetails,
  className,
  onCardClick,
  onFollowClick,
  onChatClick,
  slug,
  href = "",
  isFollowed = false,
  isLoading = false,
}) => {
  const isMySelf = useSelector((state) => state.users.userSlug === slug);

  return (
    <li id={id} className={`min-h-[10rem] list-none`}>
      <div
        className={clsx(
          "relative h-full rounded-2.5xl border  p-2  md:rounded-3xl md:p-3",
          className
        )}
      >
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-start p-4 gap-4">
            <Link
              href={href}
              className="w-fit flex flex-row items-center gap-2 cursor-pointer hover:underline"
              onClick={onCardClick}
            >
              {icon}
              <span>{userDetails}</span>
            </Link>
            <div className="flex">
              <div className="items-center flex flex-row gap-2">
                {isMySelf ? (
                  <FootTypo footlabel="You" className="!m-0 font-semibold" />
                ) : (
                  <div className="items-center flex flex-row gap-2">
                    {isLoading ? (
                      <Skeleton animation="wave" width={100} height={40} />
                    ) : (
                      <>
                        <Button
                          label={isFollowed ? "Unfollow" : "Follow"}
                          icon={isFollowed ? <IoClose /> : <FaPlus />}
                          className={isFollowed ? "bg-red" : "bg-primary"}
                          onClick={onFollowClick}
                        />
                        <Button
                          label="Message"
                          icon={<IoChatboxEllipsesOutline />}
                          onClick={onChatClick}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
