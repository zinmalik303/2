import { Task, TaskSubmission, User } from '../types';

export const mockUser: User = {
  username: 'Web3 User',
  avatar: null,
  balance: 0,
  tasksCompleted: 0,
  totalEarned: 0,
  level: 1,
  referralCode: 'xyz123',
  joinedAt: new Date().toISOString(),
  congratulated: false,
};

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Post a Sonavo Image on CoinMarketCap',
    description: 'Create a unique post on CoinMarketCap with one of the specified tokens and an image.',
    difficulty: 'Easy',
    reward: 8.00,
    link: 'https://coinmarketcap.com/currencies/bitcoin/',
    instructions: 'Choose one token from the list, download and attach the provided image, write a unique crypto-related message, include the chosen token symbol.',
    createdAt: new Date().toISOString(),
    isHot: true,
    imageUrl: 'https://images.pexels.com/photos/843700/pexels-photo-843700.jpeg',
    tokens: [
      { symbol: '$BTC', url: 'https://coinmarketcap.com/currencies/bitcoin/' },
      { symbol: '$XRP', url: 'https://coinmarketcap.com/currencies/xrp/' },
      { symbol: '$PI', url: 'https://coinmarketcap.com/currencies/pi/' },
      { symbol: '$ETH', url: 'https://coinmarketcap.com/currencies/ethereum/' },
      { symbol: '$SOL', url: 'https://coinmarketcap.com/currencies/solana/' }
    ]
  },
  {
    id: '2',
    title: 'Post on CoinMarketCap using $MAT',
    description: 'Create a short, meaningful post that includes the token $MAT on the Matchain project page.',
    difficulty: 'Easy',
    reward: 6.00,
    link: 'https://coinmarketcap.com/currencies/matchain/',
    instructions: 'Visit the Matchain page on CoinMarketCap, create a meaningful post that includes $MAT token.',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Add $OASIS to your CoinGecko Watchlist',
    description: 'Add the Oasis token to your personal Watchlist by clicking the ★ icon.',
    difficulty: 'Easy',
    reward: 3.00,
    link: 'https://www.coingecko.com/en/coins/oasis',
    instructions: 'Go to CoinGecko, find the Oasis token page, and add it to your watchlist.',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Follow BitDAO on Snapshot',
    description: 'Go to the Snapshot platform and follow BitDAO by clicking the "Follow" button.',
    difficulty: 'Easy',
    reward: 2.00,
    link: 'https://snapshot.box/#/s:bitdao.eth',
    instructions: 'Visit the BitDAO page on Snapshot platform and click the "Follow" button at the top of the page.',
    createdAt: new Date().toISOString(),
    type: 'Snapshot / Social'
  },
  {
    id: '5',
    title: 'Complete "Get Started" on Layer3',
    description: 'Complete the "Get Started" quest on Layer3 platform which includes basic onboarding actions.',
    difficulty: 'Easy',
    reward: 2.00,
    link: 'https://app.layer3.xyz/activations/get-started',
    instructions: 'Find the "Get Started" quest under Featured or Quests section. Complete all steps including following, connecting, and reading. Submit a screenshot showing the quest marked as "Completed" or all steps checked.',
    createdAt: new Date().toISOString(),
    type: 'Quest / Layer3'
  },
  {
    id: '6',
    title: 'Join BullPerks Campaign on TaskOn',
    description: 'Connect to the BullPerks campaign on TaskOn platform.',
    difficulty: 'Easy',
    reward: 1.00,
    link: 'https://taskon.xyz/BullPerks',
    instructions: 'Visit the BullPerks campaign page and click "Join Campaign" at the top. Submit a screenshot showing "In Progress" or confirmed participation.',
    createdAt: new Date().toISOString(),
    type: 'TaskOn / Campaign'
  },
  {
    id: '7',
    title: 'Earn Points on BullPerks (TaskOn)',
    description: 'Complete available tasks on BullPerks campaign to earn 100 Points.',
    difficulty: 'Easy',
    reward: 3.00,
    link: 'https://taskon.xyz/BullPerks?oauth_type=Twitter',
    instructions: 'Complete any available task (Follow on Twitter, Join Telegram, Link Email, Visit Webpage, etc.). Click "Verify & Claim" to receive 100 Points. Submit a screenshot showing your earned 100 Points.',
    createdAt: new Date().toISOString(),
    type: 'TaskOn / Activity'
  },
  {
    id: '8',
    title: 'Follow DeFiWhale on DeBank',
    description: 'Visit the following profile on DeBank and follow DeFiWhale profile.',
    difficulty: 'Easy',
    reward: 4.00,
    link: 'https://debank.com/profile/0x3e8734ec146c981e3ed1f6b582d447dde701d90c/stream',
    instructions: 'Visit the DeFiWhale profile on DeBank and click the "+ Following" button to follow the profile. DeBank is a trusted DeFi portfolio platform used by whales and traders.',
    createdAt: new Date().toISOString(),
    type: 'DeBank / Social'
  },
  {
    id: '9',
    title: 'Follow Brahma on DeBank',
    description: 'Go to the official Brahma profile on DeBank and follow the account.',
    difficulty: 'Easy',
    reward: 1.00,
    link: 'https://debank.com/official/Brahma/stream',
    instructions: 'Visit the official Brahma profile on DeBank and click the "+ Following" button to follow the account.',
    createdAt: new Date().toISOString(),
    type: 'DeBank / Social'
  },
  {
    id: '10',
    title: 'Engage with Aave\'s Video Post on Warpcast',
    description: 'Like and Recast Aave\'s video post on Warpcast platform.',
    difficulty: 'Easy',
    reward: 1.00,
    link: 'https://hey.xyz/posts/1w639hnr5xt75n6r273',
    instructions: 'Go to the post by @aave on Warpcast. Like 👍 and Recast 🔁 (repost) the video.',
    createdAt: new Date().toISOString(),
    type: 'Warpcast / Social'
  },
  {
    id: '11',
    title: 'Follow RLinda on TradingView',
    description: 'Follow RLinda, one of the top crypto analysts on TradingView.',
    difficulty: 'Easy',
    reward: 2.00,
    link: 'https://www.tradingview.com/u/RLinda/',
    instructions: 'Visit the TradingView profile and click the "Follow" button at the top of the profile to follow this author. RLinda is one of the top crypto analysts on the platform.',
    createdAt: new Date().toISOString(),
    type: 'TradingView / Social'
  },
  {
  id: 'survey',
  title: 'Answer a Short Survey',
  description: 'Help us understand your Web3 interests.',
  difficulty: 'Easy',
  reward: 0.00,
  link: '',
  instructions: 'Answer all questions to complete this task.',
  createdAt: new Date().toISOString(),
  type: 'Internal / Survey'
},
{
  id: 'telegram',
  title: 'Join Telegram',
  description: 'Join our Telegram community to stay informed and connected.',
  difficulty: 'Easy',
  reward: 0,
  link: 'https://t.me/+atUr8L_y6nJhMWVi',
  instructions: 'Open the Telegram link and click "Join".',
  createdAt: new Date().toISOString(),
  type: 'Social'
},
{
  id: 'instagram',
  title: 'Follow on Instagram',
  description: 'Follow us on Instagram to receive the latest updates.',
  difficulty: 'Easy',
  reward: 0,
  link: 'https://www.instagram.com/',
  instructions: 'Go to our Instagram page and click "Follow".',
  createdAt: new Date().toISOString(),
  type: 'Social'
}


];

export const mockSubmissions: TaskSubmission[] = [];