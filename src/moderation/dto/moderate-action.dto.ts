export class ModerateActionDto {
    moderatorId: string;
    targetType: 'issue' | 'comment' | 'user' | 'report';
    targetId: string;
    action: 'hide' | 'ban' | 'unban' | 'edit' | 'note';
    reason?: string;
}
