# minisvelte

Transforming the svelte code below to valid optimised javascript

<script>
  let counter = 0;

  const increment = () => counter++;
  const decrement = () => counter--;
</script>

<button on:click={decrement}>Decrement</button>
{counter}
<button on:click={increment}>Increment</button>

<style>
    
</style>

'''
