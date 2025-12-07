"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Camera, MenuIcon } from "lucide-react";
import React from "react";
import ContactModal from "../ContactModal";

export function FloatingHeader() {
  const [open, setOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const links = [
    // {
    //   label: "Features",
    //   href: "#",
    // },
    // {
    //   label: "Pricing",
    //   href: "#",
    // },
    // {
    //   label: "About",
    //   href: "#",
    // },
    {
      label: "Contact Us",
    },
  ];

  return (
    <header
      className={cn(
        "sticky top-5 z-50",
        "mx-auto w-full max-w-3xl rounded-lg border shadow",
        "bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-lg"
      )}
    >
      <nav className="mx-auto flex items-center justify-between p-1.5">
        <div className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100">
          <Camera className="size-5" />
          <p className="font-mono text-base font-bold">OpenPic</p>
        </div>
        <div className="hidden items-center gap-1 lg:flex">
          {/* {links.map((link, index) => {
            if (index !== links.length - 1) {
              return (
                <a
                  key={index}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                  href={link.href}
                >
                  {link.label}
                </a>
              );
            }
            return null;
          })} */}
        </div>
        <div className="hidden lg:flex">
          <a
            key={links.length - 1}
            onClick={() => setIsModalOpen(true)}
            className={`${buttonVariants({
              variant: "secondary",
              size: "sm",
            })} cursor-pointer hover:bg-white transition-colors duration-500`}
          >
            {links[links.length - 1].label}
          </a>
        </div>
        <div className="flex md:hidden items-center gap-2">
          {/* <Button size="sm">Login</Button> */}
          <Sheet open={open} onOpenChange={setOpen}>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setOpen(!open)}
              className="lg:hidden"
            >
              <MenuIcon className="size-4" />
            </Button>
            <SheetContent
              className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
              showClose={false}
              side="left"
            >
              <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                {/* {links.map((link, index) => {
            if (index !== links.length - 1) {
              return (
                <a
                  key={index}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                  href={link.href}
                >
                  {link.label}
                </a>
              );
            }
            return null;
          })} */}
                <a
                  key={links.length - 1}
                  onClick={() => setIsModalOpen(true)}
                  className={`${buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })} cursor-pointer hover:bg-white transition-colors duration-500`}
                >
                  {links[links.length - 1].label}
                </a>
              </div>
              <SheetFooter>
                {/* <Button variant="outline">Sign In</Button> */}
                {/* <Button>Get Started</Button> */}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Contact Us"
        subtitle="Tell us about your needs and we'll create the perfect solution for you"
      />
    </header>
  );
}
