import React, { useRef } from "react";
import styled from "styled-components";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";

import { LearningItemType } from "components/common/LearningModuleDnd/types";
import { TextButtonWithHover } from "components/common/Button";
import { formatDocumentRoute } from "config/Routes";
import {
  ActionMenuDropdown,
  IMenuItem,
} from "components/common/ActionMenuDropdown";
import useDocumentStore from "context/DocumentV2Store";
import { ArrowDocument } from "components/common/IconSvg";
import usePermission from "hook/UsePermission";
import { SpaceActionPermission } from "graphql/types";
import DocumentTypeIcon from "./DocumentTypeIcon";
import CreateContentButton from "./CreateContentButton";

export const DEFAULT_DOCUMENT_TITLE = "Untitled";

export type DocumentItemProps = {
  item: LearningItemType;
  dragging: boolean;
  collapsed?: boolean;
  onChangeCollapsed?: () => void;
  hasChildren: boolean;
};

const LessonItem = ({
  collapsed,
  item,
  dragging,
  onChangeCollapsed,
  hasChildren,
}: DocumentItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const allow = usePermission();

  const documentTitle = useDocumentStore(
    (state) =>
      state.spaceDocuments.find((spaceDoc) => spaceDoc.id === item.id)?.title,
  );

  const onClickCollapse = (e: MouseEvent) => {
    e.stopPropagation();
    if (onChangeCollapsed) onChangeCollapsed();
  };

  const menuList: IMenuItem<LearningItemType>[] = [];

  const active = router.query.documentId === item.id;
  const icon = !hasChildren ? (
    <MinusDocument />
  ) : (
    <ArrowDocument
      style={{ transform: `rotate(${collapsed ? 180 : 270}deg)` }}
      onClick={onClickCollapse}
    />
  );

  return (
    <Link href={formatDocumentRoute(item.id)} passHref>
      <LessonItemContainer ref={ref} $active={active}>
        {icon}
        <span style={{ display: "flex" }}>
          <DocumentTypeIcon documentType={item.documentType} />
        </span>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <div style={{ flex: "1", display: "inline-grid" }}>
            {item.parentId ? (
              <StyledText ellipsis $active={active}>
                {documentTitle || DEFAULT_DOCUMENT_TITLE}
              </StyledText>
            ) : (
              <StyledText ellipsis>
                {documentTitle || DEFAULT_DOCUMENT_TITLE}
              </StyledText>
            )}
          </div>
          {allow(SpaceActionPermission.MANAGE_SPACE_CONTENT) && !dragging && (
            <ButtonGroup>
              <ActionMenuDropdown
                item={item}
                menuList={menuList}
                hasPermission={true}
              >
                <StyledButton
                  icon={<MoreOutlined />}
                  type="text"
                  size={"small"}
                  onClick={(e) => e.stopPropagation()}
                />
              </ActionMenuDropdown>
              <CreateContentButton parentId={item.id}>
                <StyledButton
                  icon={<PlusOutlined />}
                  type="text"
                  size={"small"}
                  onClick={(e) => e.stopPropagation()}
                />
              </CreateContentButton>
            </ButtonGroup>
          )}
        </div>
      </LessonItemContainer>
    </Link>
  );
};

const StyledText = styled(Typography.Text)<{
  $active?: boolean;
  $weight?: number;
}>`
  color: ${(props) => props.theme.colors.gray[7]};
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: ${(props) => props.$weight || 500};
  line-height: normal;
  letter-spacing: -0.014px;
`;

const StyledButton = styled(TextButtonWithHover)`
  margin: unset;
  color: #888e9c;
`;

const ButtonGroup = styled.div`
  display: none;
  padding: 0 5px;
`;

const LessonItemContainer = styled.div<{
  $active?: boolean;
  $editing?: boolean;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 5px 0 10px;
  height: 38px;
  gap: 8px;
  cursor: pointer;
  background-color: ${(props) => {
    if (props.$editing) {
      return props.theme.colors.gray[0];
    }
    if (props.$active) {
      return props.theme.colors.gray[2];
    }
    return "unset";
  }};
  box-shadow: ${(props) => {
    if (props.$editing) {
      return `
        0px 9px 28px 8px rgba(0, 0, 0, 0.05), 
        0px 3px 6px -4px rgba(0, 0, 0, 0.12), 
        0px 6px 16px 0px rgba(0, 0, 0, 0.08)
      `;
    }
  }};
  border-radius: 8px;

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.gray[props.$editing ? 0 : 2]};
    ${ButtonGroup} {
      display: flex;
    }
  }
`;

const MinusDocument = styled.div`
  width: 20px;
  height: 20px;
  position: relative;

  &::before {
    content: "";
    width: 6px;
    height: 0.5px;
    background: #272f3e;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
`;

export default LessonItem;