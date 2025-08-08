"use client";

import * as React from "react";

import {
  ChangePasswordFormValues,
  changePasswordInput,
} from "@/lib/validations/user";
import {
  DialogResponsive,
  DialogResponsiveContent,
  DialogResponsiveFooter,
  DialogResponsiveHeader,
  DialogResponsiveTitle,
} from "@/components/ui/dialog-responsive";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChangePassword } from "@/hooks/use-profile";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function ChangePasswordDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Profile");
  const { mutateAsync, isPending } = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordInput),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    await mutateAsync(values);
  };

  return (
    <DialogResponsive>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogResponsiveContent>
        <DialogResponsiveHeader>
          <DialogResponsiveTitle>
            {t("security.changePassword.title")}
          </DialogResponsiveTitle>
        </DialogResponsiveHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("security.changePassword.current")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("security.changePassword.new")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("security.changePassword.confirm")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogResponsiveFooter>
              <Button type="submit" isLoading={isPending}>
                {t("form.saveChanges")}
              </Button>
            </DialogResponsiveFooter>
          </form>
        </Form>
      </DialogResponsiveContent>
    </DialogResponsive>
  );
}
