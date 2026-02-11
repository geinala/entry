"use client";

import Logo from "@/app/_components/logo";
import { Paragraph, Title } from "@/app/_components/typography";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/_components/ui/card";
import { GoogleLoginButton } from "./google-login.button";
import { Button } from "@/app/_components/ui/button";

export default function SignInForm() {
  return (
    <Card className="w-96">
      <CardHeader className="justify-center items-center flex flex-col text-center">
        <Logo />
        <Title level={5}>Sign in to Routify</Title>
        <Paragraph>Welcome back! Please enter your credentials to continue.</Paragraph>
      </CardHeader>
      <CardContent className=" flex justify-center items-center">
        <GoogleLoginButton />
      </CardContent>
      <CardFooter className="text-center justify-center">
        <Paragraph>
          Secured by{" "}
          <Button variant={"link"} size={"none"}>
            Clerk Auth
          </Button>
        </Paragraph>
      </CardFooter>
    </Card>
  );
}
