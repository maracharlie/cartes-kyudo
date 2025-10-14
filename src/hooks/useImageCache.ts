import { useState, useEffect } from 'react';

// Map image queries to Unsplash URLs
const IMAGE_MAP: Record<string, string> = {
  'japanese archery': 'https://images.unsplash.com/photo-1759353296514-a656159d708a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGFyY2hlcnl8ZW58MXx8fHwxNzYwMzgxMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'japanese bow yumi': 'https://img.maracharlie.com/japanese_bow_yumi.jpg',
  'japanese arrow': 'https://img.maracharlie.com/japanese_arrow.jpg',
  'archery target': 'https://images.unsplash.com/photo-1485802240079-a8245c843b95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoZXJ5JTIwdGFyZ2V0fGVufDF8fHx8MTc2MDM4MTM3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'kyudo dojo': 'https://images.unsplash.com/photo-1632653223454-ca18a3777b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreXVkbyUyMGRvam98ZW58MXx8fHwxNzYwMzgxMzcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'kyudo shooting range': 'https://images.unsplash.com/photo-1750790774010-a5ccea3b855a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreXVkbyUyMHNob290aW5nJTIwcmFuZ2V8ZW58MXx8fHwxNzYwMzgxMzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'kyudo posture': 'https://images.unsplash.com/photo-1699787167971-db840f61c3bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreXVkbyUyMHBvc3R1cmV8ZW58MXx8fHwxNzYwMzgxMzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'feet stance archery': 'https://images.unsplash.com/photo-1741790053537-c34a2e90ed40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZWV0JTIwc3RhbmNlJTIwYXJjaGVyeXxlbnwxfHx8fDE3NjAzODEzNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'posture stance': 'https://images.unsplash.com/photo-1513266913343-a1bfd2ffd806?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3N0dXJlJTIwc3RhbmNlfGVufDF8fHx8MTc2MDM4MTM3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'yugamae': 'https://img.maracharlie.com/yugamae.png',
  'ichiokoshi': 'https://img.maracharlie.com/uchiokoshi.png',
  'hikiwake': 'https://img.maracharlie.com/hikiwake.png',
  'kai': 'https://img.maracharlie.com/kai.png',
  'arrow release': 'https://images.unsplash.com/photo-1499887263958-159e6036b53d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnJvdyUyMHJlbGVhc2V8ZW58MXx8fHwxNzYwMzgxMzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'zanshin': 'https://img.maracharlie.com/zanshin.png',
  'japanese bow respect': 'https://images.unsplash.com/photo-1716524830848-a5d1c1056aaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGJvdyUyMHJlc3BlY3R8ZW58MXx8fHwxNzYwMzgxMzc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'breathing meditation': 'https://images.unsplash.com/photo-1716284129276-c84a6b77325f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhdGhpbmclMjBtZWRpdGF0aW9ufGVufDF8fHx8MTc2MDM4MTM3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'martial arts spirit': 'https://images.unsplash.com/photo-1529630218527-7df22fc2d4ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJ0aWFsJTIwYXJ0cyUyMHNwaXJpdHxlbnwxfHx8fDE3NjAzODEzODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'zen archery': 'https://images.unsplash.com/photo-1664811581329-5f999b7d7450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6ZW4lMjBhcmNoZXJ5fGVufDF8fHx8MTc2MDM4MTM4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'kyudo glove': 'https://images.unsplash.com/photo-1579178937321-3ac1437a28ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreXVkbyUyMGdsb3ZlfGVufDF8fHx8MTc2MDM4MTM4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'hakama traditional': 'https://images.unsplash.com/photo-1544388762-2741b4d86c1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWthbWElMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjAzODEzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'japanese obi belt': 'https://images.unsplash.com/photo-1758229484027-03ed976417f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMG9iaSUyMGJlbHR8ZW58MXx8fHwxNzYwMzgxMzgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'arrow feathers': 'https://images.unsplash.com/photo-1759502330400-f2820f8c3088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnJvdyUyMGZlYXRoZXJzfGVufDF8fHx8MTc2MDM4MTM4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'arrow nock': 'https://img.maracharlie.com/arrow_nock.png',
  'arrow nock detail': 'https://images.unsplash.com/photo-1755418486388-2605c7128aa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnJvdyUyMG5vY2slMjBkZXRhaWx8ZW58MXx8fHwxNzYwMzgxMzg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'bow string': 'https://images.unsplash.com/photo-1586739413532-7f7e0e673573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3clMjBzdHJpbmd8ZW58MXx8fHwxNzYwMzgxMzg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'thumb pressure archery': 'https://images.unsplash.com/photo-1748616574632-0f3017a5f58c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHVtYiUyMHByZXNzdXJlJTIwYXJjaGVyeXxlbnwxfHx8fDE3NjAzODEzODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'hand grip bow': 'https://images.unsplash.com/photo-1578339123566-7c37486d5046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kJTIwZ3JpcCUyMGJvd3xlbnwxfHx8fDE3NjAzODEzODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'bow rotation archery': 'https://images.unsplash.com/photo-1689794500548-ec0663c50526?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3clMjByb3RhdGlvbiUyMGFyY2hlcnl8ZW58MXx8fHwxNzYwMzgxMzg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'arrow trajectory': 'https://images.unsplash.com/photo-1622142370000-00d99a574b26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnJvdyUyMHRyYWplY3Rvcnl8ZW58MXx8fHwxNzYwMzgxMzg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'kyudo ceremony': 'https://images.unsplash.com/photo-1563021482-00a3ffc719ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreXVkbyUyMGNlcmVtb255fGVufDF8fHx8MTc2MDM4MTM4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'kyudo lineup': 'https://images.unsplash.com/photo-1668392296954-5b2353d1b17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreXVkbyUyMGxpbmV1cHxlbnwxfHx8fDE3NjAzODEzODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'bullseye target': 'https://images.unsplash.com/photo-1643538034773-3055040a8981?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWxsc2V5ZSUyMHRhcmdldHxlbnwxfHx8fDE3NjAzODEzODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'missed target': 'https://images.unsplash.com/photo-1594652634010-275456c808d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXNzZWQlMjB0YXJnZXR8ZW58MXx8fHwxNzYwMzgxMzg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'straw target archery': 'https://images.unsplash.com/photo-1742641849162-174c281af15e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhdyUyMHRhcmdldCUyMGFyY2hlcnl8ZW58MXx8fHwxNzYwMzgxMzg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'shooting position': 'https://images.unsplash.com/photo-1702294186136-d9b015e6693b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9vdGluZyUyMHBvc2l0aW9ufGVufDF8fHx8MTc2MDM4MTM4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'archer position': 'https://images.unsplash.com/photo-1562008752-2459495a0c05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoZXIlMjBwb3NpdGlvbnxlbnwxfHx8fDE3NjAzODEzODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'before target archery': 'https://images.unsplash.com/photo-1654281700092-13c56ee48fc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWZvcmUlMjB0YXJnZXQlMjBhcmNoZXJ5fGVufDF8fHx8MTc2MDM4MTM4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'kyudo ceremony ritual': 'https://images.unsplash.com/photo-1752146506745-75d39c869980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreXVkbyUyMGNlcmVtb255JTIwcml0dWFsfGVufDF8fHx8MTc2MDM4MTM4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'dojo entrance': 'https://images.unsplash.com/photo-1549963214-775caabc89e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2pvJTIwZW50cmFuY2V8ZW58MXx8fHwxNzYwMzgxMzg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'dojo exit': 'https://images.unsplash.com/photo-1577606969930-d61d40af13c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2pvJTIwZXhpdHxlbnwxfHx8fDE3NjAzODEzODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'martial arts ranking': 'https://images.unsplash.com/photo-1550759807-50dc0b381a1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJ0aWFsJTIwYXJ0cyUyMHJhbmtpbmd8ZW58MXx8fHwxNzYwMzgxMzg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'martial arts master': 'https://images.unsplash.com/photo-1686729917714-ced212e45227?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJ0aWFsJTIwYXJ0cyUyMG1hc3RlcnxlbnwxfHx8fDE3NjAzODEzODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'beginner student': 'https://images.unsplash.com/photo-1673515334462-8ec684bd664b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWdpbm5lciUyMHN0dWRlbnR8ZW58MXx8fHwxNzYwMzgxMzg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'martial arts training': 'https://images.unsplash.com/photo-1725813961320-151288b4c4db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJ0aWFsJTIwYXJ0cyUyMHRyYWluaW5nfGVufDF8fHx8MTc2MDM1NTA4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
};

export function useImageCache(imageQuery: string): string {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = IMAGE_MAP[imageQuery] || IMAGE_MAP['japanese archery']; // Fallback
    setImageUrl(url);
  }, [imageQuery]);

  return imageUrl;
}
