use crate::authorization::SpaceActionPermission;
use async_graphql::*;

use crate::db::*;
use crate::error::IkigaiErrorExt;
use crate::helper::{
    get_conn_from_ctx, get_space_allowed_permissions, get_user_id_from_ctx, space_quick_authorize,
};

#[derive(Default)]
pub struct SpaceQuery;

#[Object]
impl SpaceQuery {
    async fn space_my_permissions(
        &self,
        ctx: &Context<'_>,
        space_id: i32,
    ) -> Result<Vec<SpaceActionPermission>> {
        get_space_allowed_permissions(ctx, space_id).await
    }

    async fn space_get(&self, ctx: &Context<'_>, space_id: i32) -> Result<Space> {
        space_quick_authorize(ctx, space_id, SpaceActionPermission::ViewSpaceContent).await?;

        let mut conn = get_conn_from_ctx(ctx).await?;
        let class = Space::find_by_id(&mut conn, space_id).format_err()?;
        Ok(class)
    }

    async fn space_mine(&self, ctx: &Context<'_>) -> Result<Vec<Space>> {
        let user_id = get_user_id_from_ctx(ctx).await?;
        let mut conn = get_conn_from_ctx(ctx).await?;
        Space::find_my_spaces(&mut conn, user_id).format_err()
    }

    async fn space_get_invite_tokens(
        &self,
        ctx: &Context<'_>,
        space_id: i32,
    ) -> Result<Vec<SpaceInviteToken>> {
        space_quick_authorize(ctx, space_id, SpaceActionPermission::ManageSpaceMember).await?;
        let mut conn = get_conn_from_ctx(ctx).await?;
        SpaceInviteToken::find_all_by_spaces(&mut conn, space_id).format_err()
    }
}
