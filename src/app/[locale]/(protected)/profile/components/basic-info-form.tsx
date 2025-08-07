"use client";

import { AtSign, FileText, Mail, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { ProfileFormData } from "../schemas/profile-schema";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";

export function BasicInfoForm() {
  const t = useTranslations("Profile");
  const form = useFormContext<ProfileFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {t("basicInfo.title")}
        </CardTitle>
        <CardDescription>{t("basicInfo.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("basicInfo.firstName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("basicInfo.firstNamePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("basicInfo.lastName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("basicInfo.lastNamePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t("basicInfo.email")}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("basicInfo.emailPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <AtSign className="w-4 h-4" />
                {t("basicInfo.username")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("basicInfo.usernamePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t("basicInfo.bio")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("basicInfo.bioPlaceholder")}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
