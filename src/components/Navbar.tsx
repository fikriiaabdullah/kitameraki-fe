import { makeStyles, tokens, Tab, TabList, Text } from '@fluentui/react-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardTaskListLtrRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
    navbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${tokens.spacingHorizontalXXL}`,
        backgroundColor: '#0078d4',
        height: '48px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
    },
    brandIcon: {
        color: 'white',
        fontSize: '20px',
    },
    brandText: {
        color: 'white',
        fontWeight: tokens.fontWeightSemibold,
        fontSize: tokens.fontSizeBase400,
        letterSpacing: '0.3px',
    },
    tabList: {
        gap: tokens.spacingHorizontalXS,
    },
    tab: {
        color: 'rgba(255,255,255,0.8) !important',
        ':hover': {
            color: 'white !important',
            backgroundColor: 'rgba(255,255,255,0.1) !important',
        },
        ':selected': {
            color: 'white !important',
        },
    },
});

export default function Navbar() {
    const styles = useStyles();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className={styles.navbar}>
            <div className={styles.brand}>
                <ClipboardTaskListLtrRegular fontSize={22} color="white" />
                <Text className={styles.brandText}>Task Manager</Text>
            </div>
            <TabList
                selectedValue={location.pathname}
                onTabSelect={(_, data) => navigate(data.value as string)}
                appearance="subtle"
                className={styles.tabList}
            >
                <Tab value="/tasks" className={styles.tab} style={{ color: 'rgba(255,255,255,0.85)' }}>
                    Tasks
                </Tab>
                <Tab value="/settings" className={styles.tab} style={{ color: 'rgba(255,255,255,0.85)' }}>
                    Settings
                </Tab>
            </TabList>
        </nav>
    );
}