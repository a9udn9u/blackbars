import { HoverCard, HoverCardProps } from "@mantine/core";

import './info-bubble.scss'

export const InfoBubble = (props: HoverCardProps) => {
  const {children, ...otherProps} = props;
  return (
    <HoverCard {...otherProps}>
      <HoverCard.Target>
        <abbr className="explanation"/>
      </HoverCard.Target>
      <HoverCard.Dropdown miw='320px' maw='75vw'>
        {props.children}
      </HoverCard.Dropdown>
    </HoverCard>
  );
};