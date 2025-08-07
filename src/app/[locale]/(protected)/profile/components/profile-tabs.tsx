"use client";

import {
  TabsResponsive,
  TabsResponsiveContent,
  TabsResponsiveList,
  TabsResponsiveTrigger,
} from "@/components/ui/tabs-responsive";

import { BasicInfoForm } from "./basic-info-form";
import { NotificationsTab } from "./notifications-tab";
import { SecurityTab } from "./security-tab";
import { useTranslations } from "next-intl";

export function ProfileTabs() {
  const t = useTranslations("Profile");

  return (
    <TabsResponsive defaultValue="basic-info" className="w-full">
      <TabsResponsiveList className="grid w-full grid-cols-3">
        <TabsResponsiveTrigger value="basic-info">
          {t("tabs.basicInfo")}
        </TabsResponsiveTrigger>
        <TabsResponsiveTrigger value="notifications">
          {t("tabs.notifications")}
        </TabsResponsiveTrigger>
        <TabsResponsiveTrigger value="security">
          {t("tabs.security")}
        </TabsResponsiveTrigger>
      </TabsResponsiveList>

      <TabsResponsiveContent value="basic-info" className="space-y-4">
        <BasicInfoForm />
      </TabsResponsiveContent>

      <TabsResponsiveContent value="notifications" className="space-y-4">
        <NotificationsTab />
      </TabsResponsiveContent>

      <TabsResponsiveContent value="security" className="space-y-4">
        <SecurityTab />
      </TabsResponsiveContent>
    </TabsResponsive>
  );
}
