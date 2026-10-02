<script>
  import { onMount } from 'svelte';
  import { generatePhonePeTxnId, generateUTR } from './lib/txnId.js';
  import { addTransaction, getAllTransactions } from './lib/store.js';

  let screen = $state('home');
  let upiId = $state('');
  let receiverName = $state('');
  let amount = $state('');
  let message = $state('');
  let pin = $state('');
  let txn = $state(null);
  let history = $state([]);
  let audioEl = null;
  let showTransferDetails = $state(true);

  onMount(() => {
    history = getAllTransactions();
    const unlock = () => {
      if (!audioEl) {
        audioEl = new Audio('/assets/audio/phonepe_success.mp3');
        audioEl.preload = 'auto';
        try { audioEl.load(); } catch {}
      }
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('click', unlock);
    };
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('click', unlock, { once: true });
  });

  function deriveName(upi) {
    if (!upi) return '';
    const local = upi.split('@')[0] || upi;
    const cleaned = local.replace(/[._-]/g, ' ').replace(/\d+/g, ' ').trim();
    return (cleaned || local).toUpperCase();
  }

  function handleUpiChange() {
    if (!receiverName.trim()) receiverName = deriveName(upiId);
  }

  function goRecipient() {
    upiId = ''; receiverName = ''; amount = ''; message = ''; pin = '';
    screen = 'recipient';
  }

  function goAmount() {
    if (!upiId.trim() || !receiverName.trim()) return;
    if (!upiId.includes('@')) upiId = upiId + '@upi';
    screen = 'amount';
  }

  function proceedToPay() {
    if (!amount || parseFloat(amount) <= 0) return;
    pin = '';
    screen = 'pin';
  }

  function keypadInput(d) {
    if (screen === 'amount') {
      if (d === '.' && amount.includes('.')) return;
      if (amount.includes('.') && amount.split('.')[1].length >= 2) return;
      amount = (amount + d).slice(0, 10);
    } else if (screen === 'pin') {
      if (pin.length < 6) pin += d;
    }
  }

  function keypadBackspace() {
    if (screen === 'amount') amount = amount.slice(0, -1);
    else if (screen === 'pin') pin = pin.slice(0, -1);
  }

  function keypadClear() {
    if (screen === 'amount') amount = '';
    else if (screen === 'pin') pin = '';
  }

  function submitPin() {
    if (pin.length !== 6) return;
    screen = 'processing';
    const audio = audioEl || new Audio('/assets/audio/phonepe_success.mp3');
    audio.preload = 'auto';
    try { audio.load(); } catch {}

    setTimeout(() => {
      const id = generatePhonePeTxnId();
      const utr = generateUTR();
      const now = new Date();
      const txnData = {
        id,
        utr,
        receiverName: receiverName.toUpperCase(),
        upiId,
        amount: parseFloat(amount),
        timestamp: now.toLocaleString('en-IN', {
          hour: '2-digit', minute: '2-digit',
          day: '2-digit', month: 'short', year: 'numeric',
          hour12: true,
        }),
        message: message || 'Pay via PhonePe',
        status: 'SUCCESS',
        createdAt: Date.now(),
        accountLast4: '5252',
      };
      addTransaction(txnData);
      txn = txnData;
      history = getAllTransactions();
      screen = 'success';
      try {
        audio.currentTime = 0;
        audio.play().catch((e) => console.log('Audio blocked:', e));
      } catch (e) { console.log(e); }
    }, 2000);
  }

  function resetToHome() {
    screen = 'home';
    upiId = ''; receiverName = ''; amount = ''; message = ''; pin = ''; txn = null;
  }

  function openDetail(t) { txn = t; screen = 'detail'; }

  function initials(name) {
    if (!name) return '??';
    const parts = name.split(/\s+/).filter(Boolean).slice(0, 2);
    return parts.map((w) => w[0]).join('').toUpperCase() || name.slice(0, 2).toUpperCase();
  }

  function fmt(n) {
    return new Intl.NumberFormat('en-IN').format(n);
  }
</script>

<div class="flex-1 flex flex-col bg-white relative overflow-hidden">

  {#if screen === 'home'}
    <div class="bg-[#5f259f] text-white px-5 pt-12 pb-8">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5f259f] font-bold text-lg">₹</div>
        <div>
          <div class="text-xs opacity-80">Good morning</div>
          <div class="font-semibold">+91 98XXX XXXXX</div>
        </div>
      </div>
      <div class="mt-6 text-sm opacity-80">Available Balance</div>
      <div class="text-3xl font-bold">₹12,450.00</div>
    </div>

    <div class="grid grid-cols-4 gap-3 px-5 py-6 -mt-6 relative z-10">
      <button onclick={goRecipient} class="bg-white rounded-2xl shadow-md py-3 flex flex-col items-center gap-1">
        <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#5f259f] text-xl">➤</div>
        <span class="text-[10px] font-medium">To Mobile</span>
      </button>
      <button onclick={goRecipient} class="bg-white rounded-2xl shadow-md py-3 flex flex-col items-center gap-1">
        <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#5f259f] text-xl">▦</div>
        <span class="text-[10px] font-medium">Scan & Pay</span>
      </button>
      <button class="bg-white rounded-2xl shadow-md py-3 flex flex-col items-center gap-1">
        <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#5f259f] text-xl">▤</div>
        <span class="text-[10px] font-medium">Bank</span>
      </button>
      <button class="bg-white rounded-2xl shadow-md py-3 flex flex-col items-center gap-1">
        <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#5f259f] text-xl">☰</div>
        <span class="text-[10px] font-medium">History</span>
      </button>
    </div>

    <div class="px-5 flex-1 overflow-y-auto no-scrollbar pb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-gray-800">Recent Transactions</h3>
        {#if history.length > 0}
          <span class="text-xs text-[#5f259f] font-medium">Auto-clears in 5 min</span>
        {/if}
      </div>

      {#if history.length === 0}
        <div class="text-center py-12 text-gray-400 text-sm">
          No recent transactions.<br/>Tap <b>To Mobile</b> to make a payment.
        </div>
      {:else}
        {#each history as t}
          <button onclick={() => openDetail(t)} class="w-full flex items-center gap-3 py-3 border-b border-gray-100 text-left">
            <div class="w-11 h-11 rounded-full bg-[#00baf2] flex items-center justify-center text-white font-semibold text-sm">
              {initials(t.receiverName)}
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 truncate">{t.receiverName}</div>
              <div class="text-xs text-gray-500 truncate">{t.timestamp}</div>
            </div>
            <div class="text-right">
              <div class="font-semibold text-gray-900">₹{fmt(t.amount)}</div>
              <div class="text-[10px] text-green-600 font-medium">SUCCESS</div>
            </div>
          </button>
        {/each}
      {/if}
    </div>
  {/if}

  {#if screen === 'recipient'}
    <div class="flex-1 flex flex-col">
      <div class="px-4 pt-10 pb-4 flex items-center gap-3 border-b border-gray-100">
        <button onclick={resetToHome} class="text-2xl">←</button>
        <span class="font-medium text-lg">Pay</span>
      </div>

      <div class="px-5 pt-8 flex-1">
        <label class="block text-xs font-medium text-gray-500 mb-2">UPI ID</label>
        <input
          bind:value={upiId}
          oninput={handleUpiChange}
          placeholder="name@upi"
          class="w-full px-4 py-3 border-2 border-[#5f259f] rounded-xl text-base outline-none"
          autocapitalize="off"
          autocomplete="off"
        />

        <label class="block text-xs font-medium text-gray-500 mb-2 mt-6">Receiver Name</label>
        <input
          bind:value={receiverName}
          placeholder="Auto-filled from UPI"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl text-base outline-none focus:border-[#5f259f]"
        />

        <label class="block text-xs font-medium text-gray-500 mb-2 mt-6">Message (optional)</label>
        <input
          bind:value={message}
          placeholder="Add a message"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl text-base outline-none focus:border-[#5f259f]"
        />
      </div>

      <div class="px-5 pb-6">
        <button
          onclick={goAmount}
          disabled={!upiId || !receiverName}
          class="w-full py-4 rounded-2xl font-semibold text-white text-base disabled:opacity-40 bg-[#5f259f]">
          Proceed
        </button>
      </div>
    </div>
  {/if}

  {#if screen === 'amount'}
    <div class="flex-1 flex flex-col bg-[#f5f0fa]">
      <div class="px-4 pt-10 pb-4 flex items-center gap-3">
        <button onclick={() => screen = 'recipient'} class="text-2xl">←</button>
        <span class="font-medium text-lg">Pay</span>
        <span class="ml-auto text-2xl text-gray-400">?</span>
      </div>

      <div class="px-5 flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-[#e91e63] flex items-center justify-center text-white font-semibold">
          {initials(receiverName)}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-gray-900 truncate">{receiverName}</div>
          <div class="text-xs text-gray-500 truncate">{upiId}</div>
        </div>
      </div>

      <div class="px-5 mt-6">
        <div class="bg-white rounded-2xl px-4 py-4 border-2 border-[#5f259f]">
          <div class="text-xs text-gray-500 mb-1">Enter amount</div>
          <div class="text-3xl font-semibold text-gray-900 flex items-center">
            <span class="mr-1">₹</span>
            <span class={amount ? '' : 'text-gray-300'}>{amount || '0'}</span>
          </div>
        </div>
        <input
          bind:value={message}
          placeholder="Add a message (optional)"
          class="w-full px-4 py-3 mt-3 bg-white border border-gray-200 rounded-xl text-sm outline-none"
        />
      </div>

      <div class="flex-1"></div>

      <div class="bg-white pt-3 border-t border-gray-200">
        <button
          onclick={proceedToPay}
          disabled={!amount || parseFloat(amount) <= 0}
          class="w-full py-3 bg-gray-100 text-gray-700 font-medium disabled:opacity-40">
          Proceed To Pay
        </button>
        <div class="grid grid-cols-3 gap-px bg-gray-200">
          {#each ['1','2','3','4','5','6','7','8','9','.','0'] as k}
            <button
              onclick={() => keypadInput(k)}
              class="bg-white py-4 text-2xl font-light active:bg-gray-100">
              {k}
            </button>
          {/each}
          <button onclick={keypadBackspace} class="bg-white py-4 text-2xl active:bg-gray-100">⌫</button>
        </div>
      </div>
    </div>
  {/if}

  {#if screen === 'pin'}
    <div class="absolute inset-0 bg-black/40 z-20"></div>
    <div class="absolute inset-x-0 bottom-0 z-30 bg-white rounded-t-3xl pt-4 pb-2">
      <div class="px-5 pb-3 flex items-center gap-3 border-b border-gray-100">
        <button onclick={() => screen = 'amount'} class="text-2xl">←</button>
        <div class="flex-1 text-center font-medium">Enter UPI PIN</div>
        <div class="w-6"></div>
      </div>

      <div class="flex items-center gap-3 px-5 py-4">
        <div class="w-9 h-9 rounded-full bg-[#00baf2] flex items-center justify-center text-white text-xs font-semibold">
          {initials(receiverName)}
        </div>
        <div class="flex-1 text-sm truncate">{upiId}</div>
        <div class="font-semibold">₹{amount}</div>
      </div>

      <div class="flex justify-center gap-3 py-6">
        {#each Array(6) as _, i}
          <div class="w-4 h-4 rounded-full border-2 {i < pin.length ? 'bg-[#5f259f] border-[#5f259f]' : 'border-gray-300'}"></div>
        {/each}
      </div>

      <button
        onclick={submitPin}
        disabled={pin.length !== 6}
        class="w-full py-3 bg-[#5f259f] text-white font-medium disabled:opacity-40">
        Pay ₹{amount}
      </button>

      <div class="grid grid-cols-3 gap-px bg-gray-200 mt-2">
        {#each ['1','2','3','4','5','6','7','8','9'] as k}
          <button onclick={() => keypadInput(k)} class="bg-white py-4 text-2xl font-light active:bg-gray-100">{k}</button>
        {/each}
        <button onclick={keypadClear} class="bg-white py-4 text-sm active:bg-gray-100">CLR</button>
        <button onclick={() => keypadInput('0')} class="bg-white py-4 text-2xl font-light active:bg-gray-100">0</button>
        <button onclick={keypadBackspace} class="bg-white py-4 text-2xl active:bg-gray-100">⌫</button>
      </div>
    </div>
  {/if}

  {#if screen === 'processing'}
    <div class="flex-1 flex flex-col items-center justify-center bg-white">
      <div class="w-16 h-16 rounded-full border-4 border-[#5f259f] border-t-transparent animate-spin"></div>
      <div class="mt-6 text-gray-600 font-medium">Processing payment…</div>
      <div class="mt-2 text-sm text-gray-400">Do not close the app</div>
    </div>
  {/if}

  {#if screen === 'success'}
    <div class="flex-1 flex flex-col bg-[#00875a] text-white overflow-y-auto no-scrollbar">
      <div class="pt-16 flex flex-col items-center">
        <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
          <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#00875a] text-3xl font-bold">✓</div>
        </div>
        <div class="mt-6 text-lg font-medium text-center px-8">
          Paid successfully at {txn.timestamp.split(',')[0]}<br/>on {txn.timestamp.split(',')[1]?.trim()}
        </div>
        <div class="mt-2 text-xs opacity-80 font-mono">{txn.id}</div>
      </div>

      <div class="px-5 mt-6 flex gap-3 justify-center">
        <button onclick={() => screen = 'detail'} class="px-4 py-2 rounded-full border border-white/40 text-xs font-medium">VIEW DETAILS</button>
        <button class="px-4 py-2 rounded-full border border-white/40 text-xs font-medium">RESEND SMS</button>
      </div>

      <div class="mx-5 mt-6 bg-white rounded-2xl p-5 text-gray-900">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-[#00baf2] flex items-center justify-center text-white font-semibold">
            {initials(txn.receiverName)}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold truncate">{txn.receiverName}</div>
            <div class="text-2xl font-bold mt-1">₹{fmt(txn.amount)}</div>
          </div>
        </div>
        <div class="mt-4 text-xs text-gray-500 flex items-center gap-2">
          <span>♡</span> Add to favourites for quick access
        </div>
      </div>

      <div class="mx-5 mt-4 bg-yellow-50 rounded-2xl p-4 flex items-center gap-3 text-gray-900">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">WINZO</div>
        <div class="flex-1">
          <div class="font-semibold text-sm">You've won a new reward!</div>
          <div class="text-xs text-gray-600">Flat ₹550 in WinZO Wallet</div>
        </div>
        <div class="text-[#5f259f] text-xs font-semibold">VIEW →</div>
      </div>

      <div class="mt-6 mb-8 text-center">
        <div class="text-xs opacity-70">Powered by</div>
        <div class="mt-1 text-sm font-semibold">UPI · AXIS BANK</div>
      </div>

      <div class="px-5 pb-6">
        <button onclick={resetToHome} class="w-full py-3 rounded-2xl bg-white text-[#00875a] font-semibold">
          Done
        </button>
      </div>
    </div>
  {/if}

  {#if screen === 'detail' && txn}
    <div class="flex-1 flex flex-col bg-black text-white overflow-y-auto no-scrollbar">
      <div class="px-4 pt-10 pb-4 flex items-center gap-3">
        <button onclick={() => screen = history.length ? 'home' : 'success'} class="text-2xl">←</button>
      </div>

      <div class="px-5 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5f259f] font-bold">₹</div>
        <div>
          <div class="font-medium text-lg">Transaction Successful</div>
          <div class="text-sm opacity-70">{txn.timestamp}</div>
        </div>
      </div>

      <div class="mx-4 mt-5 bg-[#1a1a1a] rounded-2xl p-5">
        <div class="text-sm opacity-70 mb-3">Paid to</div>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-[#00baf2] flex items-center justify-center font-semibold">
            {initials(txn.receiverName)}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold truncate">{txn.receiverName}</div>
            <div class="text-xs opacity-60 truncate">{txn.upiId}</div>
          </div>
          <div class="font-bold text-lg">₹{fmt(txn.amount)}</div>
        </div>

        <div class="border-t border-white/10 mt-4 pt-4">
          <button onclick={() => showTransferDetails = !showTransferDetails} class="w-full flex items-center gap-2 text-left">
            <span>▤</span>
            <span class="flex-1">Transfer Details</span>
            <span>{showTransferDetails ? '▲' : '▼'}</span>
          </button>

          {#if showTransferDetails}
            <div class="mt-4 space-y-4 text-sm">
              <div>
                <div class="opacity-60 text-xs mb-1">Message</div>
                <div>{txn.message}</div>
              </div>
              <div>
                <div class="opacity-60 text-xs mb-1">Transaction ID</div>
                <div class="font-mono break-all">{txn.id}</div>
              </div>
              <div>
                <div class="opacity-60 text-xs mb-1">Debited from</div>
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded bg-white flex items-center justify-center">
                    <span class="text-red-500 font-bold text-xs">▣</span>
                  </div>
                  <div class="flex-1">
                    <div>XXXXXX{txn.accountLast4}</div>
                    <div class="text-xs opacity-60">UTR: {txn.utr}</div>
                  </div>
                  <div class="font-semibold">₹{fmt(txn.amount)}</div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <div class="mt-auto py-8 text-center">
        <div class="text-xs opacity-60">Powered by</div>
        <div class="mt-1 text-sm font-semibold opacity-90">UPI · AXIS BANK</div>
      </div>
    </div>
  {/if}
</div>
