import {
    Menu,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    ToolbarButton
} from '@fluentui/react-components';
import { MoreHorizontal24Filled } from '@fluentui/react-icons';
import { useNotifications } from '@renderer/lib/notifications';
import * as React from 'react';

export const NotificationsMenu: React.FC = () => {
    const notificationResponse = useNotifications();

    if (notificationResponse.loading) {
        return null;
    }
    if (notificationResponse.error) {
        return null;
    }
    const items = (notificationResponse?.value ?? []).filter((notification) => !notification.read);

    return (
        <Menu>
            <MenuTrigger>
                <ToolbarButton aria-label="More" icon={<MoreHorizontal24Filled />}>
                    Notifications ({items.length})
                </ToolbarButton>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    {items.map((notification) => (
                        <MenuItem key={notification.id} onClick={() => notificationResponse.read(notification)}>
                            {notification.title} {notification.read ? 'Read' : 'Unread'}
                        </MenuItem>
                    ))}
                    {items.length === 0 && <MenuItem>No notifications</MenuItem>}
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
