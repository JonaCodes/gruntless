import { Link, useParams } from 'react-router-dom';
import { Flex, Text, Anchor } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import EfficientImage from '../shared/EfficientImage';

type Message = {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  imgUrl?: string;
  isExtenalLink?: boolean;
};

const messages: Record<string, Message> = {
  signin: {
    title: 'Uh oh, seems there was an issue signing you in',
    subtitle:
      'Please refresh the page and try again. If the issue persists, please let the dev know. He is a friendly guy',
    imgUrl: 'v1744192759/ai-book-editor/sign-in-issue-dragon.png',
  },
  forbidden: {
    title: "Uh oh, seems like you're not meant to have access to this",
    subtitle:
      'If this was a mistake - it happens. If you are being malicious, shame on you',
    imgUrl: 'v1744192702/ai-book-editor/forbidden-dragon.png',
  },
  alpha: {
    title: "We're working really hard to make Gruntless available to everyone!",
    subtitle: 'Make sure you',
    linkText: 'join the waitlist',
    linkHref:
      'https://forms.monday.com/forms/32dc84224fa2cb949d81a206c1d6722d?r=euc1',
    imgUrl: 'v1744213504/ai-book-editor/working-hard-dragon.png',
    isExtenalLink: true,
  },
  default: {
    title: 'Looks like you got here by mistake',
    subtitle:
      "If you're sure you didn't, let the dev know. He is a friendly guy",
    imgUrl: 'v1744192779/ai-book-editor/not-found-egg.png',
  },
};

const EmptyState = observer(() => {
  const { section } = useParams<{ section?: string }>();
  const msg: Message = messages[section ?? 'default'] ?? messages.default;

  return (
    <Flex
      mih='60vh'
      direction='column'
      align='center'
      justify='center'
      gap='md'
      px='lg'
      style={{ textAlign: 'center' }}
    >
      <Text size='xl' fw={600}>
        {msg.title}
      </Text>

      {msg.subtitle && (
        <Text size='sm' c='dimmed'>
          {msg.subtitle}{' '}
          {msg.linkHref &&
            msg.linkText &&
            (msg.linkHref.startsWith('http') ? (
              <Anchor
                href={msg.linkHref}
                target={msg.isExtenalLink ? '_blank' : ''}
                size='sm'
              >
                {msg.linkText}
              </Anchor>
            ) : (
              <Link
                to={msg.linkHref}
                style={{
                  color: 'var(--mantine-color-anchor)',
                }}
              >
                {msg.linkText}
              </Link>
            ))}
        </Text>
      )}

      <EfficientImage
        name={msg.imgUrl || 'v1744192779/ai-book-editor/not-found-egg.png'}
        width={150}
        alt='Empty state illustration'
        maw={150}
        mx='auto'
        lazy={false}
      />
    </Flex>
  );
});

export default EmptyState;
