
module omicoin::omicoin {
    use std::string::{Self, String};
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, BurnCapability, FreezeCapability, MintCapability};
    
    // Error codes
    const ENO_CAPABILITIES: u64 = 1;
    const EINSUFFICIENT_BALANCE: u64 = 2;
    const ENFT_ALREADY_EXISTS: u64 = 3;
    const ENFT_DOES_NOT_EXIST: u64 = 4;
    const ENOT_OWNER: u64 = 5;
    const EINVALID_PRICE: u64 = 6;

    // Token struct
    struct OmiCoin {}

    // Capabilities struct
    struct Capabilities has key {
        burn_cap: BurnCapability<OmiCoin>,
        freeze_cap: FreezeCapability<OmiCoin>,
        mint_cap: MintCapability<OmiCoin>
    }

    // NFT struct
    struct NFT has store, key {
        id: u64,
        creator: address,
        name: String,
        description: String,
        uri: String
    }

    // Marketplace listing struct
    struct MarketplaceListing has store, drop {
        nft_id: u64,
        price: u64,
        seller: address
    }

    // State struct
    struct State has key {
        nft_counter: u64,
        listings: vector<MarketplaceListing>
    }

    // Initialize module
    fun init_module(account: &signer) {
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<OmiCoin>(
            account,
            string::utf8(b"OmiCoin"),
            string::utf8(b"OMI"),
            8,
            true
        );

        move_to(account, Capabilities {
            burn_cap,
            freeze_cap,
            mint_cap
        });

        move_to(account, State {
            nft_counter: 0,
            listings: vector::empty<MarketplaceListing>()
        });
    }

    // Mint tokens
    public entry fun mint(account: &signer, amount: u64) acquires Capabilities {
        let account_addr = signer::address_of(account);
        let caps = borrow_global<Capabilities>(@omicoin);
        let coins = coin::mint(amount, &caps.mint_cap);
        coin::deposit(account_addr, coins);
    }

    // Create NFT
    public entry fun create_nft(
        creator: &signer,
        name: String,
        description: String,
        uri: String
    ) acquires State {
        let state = borrow_global_mut<State>(@omicoin);
        let nft = NFT {
            id: state.nft_counter,
            creator: signer::address_of(creator),
            name,
            description,
            uri
        };
        state.nft_counter = state.nft_counter + 1;
        move_to(creator, nft);
    }

    // List NFT
    public entry fun list_nft(
        seller: &signer,
        nft_id: u64,
        price: u64
    ) acquires State, NFT {
        assert!(price > 0, EINVALID_PRICE);
        let seller_addr = signer::address_of(seller);
        
        assert!(exists<NFT>(seller_addr), ENFT_DOES_NOT_EXIST);
        let nft = borrow_global<NFT>(seller_addr);
        assert!(nft.id == nft_id, ENFT_DOES_NOT_EXIST);
        
        let listing = MarketplaceListing {
            nft_id,
            price,
            seller: seller_addr
        };
        
        let state = borrow_global_mut<State>(@omicoin);
        vector::push_back(&mut state.listings, listing);
    }

    // Buy NFT
    public entry fun buy_nft(
        buyer: &signer,
        nft_id: u64
    ) acquires State, NFT {
        let state = borrow_global_mut<State>(@omicoin);
        
        let (found, index) = find_listing(state, nft_id);
        assert!(found, ENFT_DOES_NOT_EXIST);
        
        let listing = vector::remove(&mut state.listings, index);
        let MarketplaceListing { nft_id: _, price, seller } = listing;
        
        // Transfer payment
        let payment = coin::withdraw<OmiCoin>(buyer, price);
        coin::deposit(seller, payment);
        
        // Transfer NFT
        assert!(exists<NFT>(seller), ENFT_DOES_NOT_EXIST);
        let nft = move_from<NFT>(seller);
        move_to(buyer, nft);
    }

    // Helper to find listing
    fun find_listing(state: &State, nft_id: u64): (bool, u64) {
        let i = 0;
        let len = vector::length(&state.listings);
        while (i < len) {
            let listing = vector::borrow(&state.listings, i);
            if (listing.nft_id == nft_id) {
                return (true, i)
            };
            i = i + 1;
        };
        (false, 0)
    }

    // Get NFT details
    #[view]
    public fun get_nft_details(owner: address, nft_id: u64): (String, String, String) acquires NFT {
        assert!(exists<NFT>(owner), ENFT_DOES_NOT_EXIST);
        let nft = borrow_global<NFT>(owner);
        assert!(nft.id == nft_id, ENFT_DOES_NOT_EXIST);
        (nft.name, nft.description, nft.uri)
    }
}
