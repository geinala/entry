"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { ItemMedia } from "@/app/_components/ui/item";
import { MapPin, Clock, Truck, CheckCircle } from "lucide-react";

interface StatisticsCardProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  footer: React.ReactNode;
}

interface DynamicCardProps {
  content?: React.ReactNode;
  footer?: React.ReactNode;
}

const StatisticsCard = ({ icon, title, content, footer }: StatisticsCardProps) => {
  return (
    <Card className="flex-1 gap-3">
      <CardHeader className="flex items-center gap-3">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
};

// TODO: Replace static data with dynamic data from simulation stats
const CARD_CONFIG = {
  distance: {
    icon: (
      <ItemMedia variant={"icon"} className="bg-blue-100 border-0">
        <MapPin className="text-blue-500" />
      </ItemMedia>
    ),
    title: "Total Distance",
    defaultContent: "1234 km",
    defaultFooter: "Since last month",
  },
  time: {
    icon: (
      <ItemMedia variant={"icon"} className="bg-orange-100 border-0">
        <Clock className="text-orange-500" />
      </ItemMedia>
    ),
    title: "Total Time Travel",
    defaultContent: "56 hours",
    defaultFooter: "Since last month",
  },
  vehicles: {
    icon: (
      <ItemMedia variant={"icon"} className="bg-purple-100 border-0">
        <Truck className="text-purple-500" />
      </ItemMedia>
    ),
    title: "Total Active Vehicles",
    defaultContent: "78 Vehicles",
    defaultFooter: "Since last month",
  },
  nodes: {
    icon: (
      <ItemMedia variant={"icon"} className="bg-green-100 border-0">
        <CheckCircle className="text-green-500" />
      </ItemMedia>
    ),
    title: "Total Completed Nodes",
    defaultContent: "45 Nodes",
    defaultFooter: "Since last month",
  },
};

const TotalDistanceCard = ({ content, footer }: DynamicCardProps) => (
  <StatisticsCard
    {...CARD_CONFIG.distance}
    content={content ?? CARD_CONFIG.distance.defaultContent} // TODO: Replace with dynamic data
    footer={footer ?? CARD_CONFIG.distance.defaultFooter} // TODO: Replace with dynamic data
  />
);

const TotalTimeTravelCard = ({ content, footer }: DynamicCardProps) => (
  <StatisticsCard
    {...CARD_CONFIG.time}
    content={content ?? CARD_CONFIG.time.defaultContent} // TODO: Replace with dynamic data
    footer={footer ?? CARD_CONFIG.time.defaultFooter} // TODO: Replace with dynamic data
  />
);

const TotalActiveVehiclesCard = ({ content, footer }: DynamicCardProps) => (
  <StatisticsCard
    {...CARD_CONFIG.vehicles}
    content={content ?? CARD_CONFIG.vehicles.defaultContent} // TODO: Replace with dynamic data
    footer={footer ?? CARD_CONFIG.vehicles.defaultFooter} // TODO: Replace with dynamic data
  />
);

const TotalCompletedNodesCard = ({ content, footer }: DynamicCardProps) => (
  <StatisticsCard
    {...CARD_CONFIG.nodes}
    content={content ?? CARD_CONFIG.nodes.defaultContent} // TODO: Replace with dynamic data
    footer={footer ?? CARD_CONFIG.nodes.defaultFooter} // TODO: Replace with dynamic data
  />
);

export { TotalDistanceCard, TotalTimeTravelCard, TotalActiveVehiclesCard, TotalCompletedNodesCard };
