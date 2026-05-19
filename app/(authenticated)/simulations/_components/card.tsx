"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { ItemMedia } from "@/app/_components/ui/item";
import { MapPin, Clock, Truck, CheckCircle } from "lucide-react";

interface StatisticsCardProps extends Omit<React.ComponentProps<typeof Card>, "content"> {
  icon?: React.ReactNode;
  title: string;
  content: React.ReactNode;
  footer: React.ReactNode;
}

interface DynamicCardProps {
  content?: React.ReactNode;
  footer?: React.ReactNode;
}

const StatisticsCard = ({ icon, title, content, footer, ...rest }: StatisticsCardProps) => {
  return (
    <Card className="flex-1 gap-3" {...rest}>
      <CardHeader className="flex items-center gap-3">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

const CARD_CONFIG = {
  distance: {
    icon: (
      <ItemMedia variant={"icon"} className="bg-blue-100 border-0">
        <MapPin className="text-blue-500" />
      </ItemMedia>
    ),
    title: "Total Distance",
  },
  time: {
    icon: (
      <ItemMedia variant={"icon"} className="bg-orange-100 border-0">
        <Clock className="text-orange-500" />
      </ItemMedia>
    ),
    title: "Total Time Travel",
  },
  vehicles: {
    icon: (
      <ItemMedia variant={"icon"} className="bg-purple-100 border-0">
        <Truck className="text-purple-500" />
      </ItemMedia>
    ),
    title: "Total Active Vehicles",
  },
  nodes: {
    icon: (
      <ItemMedia variant={"icon"} className="bg-green-100 border-0">
        <CheckCircle className="text-green-500" />
      </ItemMedia>
    ),
    title: "Total Completed Nodes",
  },
};

const TotalDistanceCard = ({ content, footer }: DynamicCardProps) => (
  <StatisticsCard {...CARD_CONFIG.distance} content={content} footer={footer} />
);

const TotalTimeTravelCard = ({ content, footer }: DynamicCardProps) => (
  <StatisticsCard {...CARD_CONFIG.time} content={content} footer={footer} />
);

const TotalActiveCouriersCard = ({ content, footer }: DynamicCardProps) => (
  <StatisticsCard {...CARD_CONFIG.vehicles} content={content} footer={footer} />
);

const TotalCompletedNodesCard = ({ content, footer }: DynamicCardProps) => (
  <StatisticsCard {...CARD_CONFIG.nodes} content={content} footer={footer} />
);

export { TotalDistanceCard, TotalTimeTravelCard, TotalActiveCouriersCard, TotalCompletedNodesCard };
